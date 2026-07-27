import { useState, useEffect, useMemo } from 'react';
import type { Book, ReadingStatus, UserReadingGoal, MoodTag, QuizQuestion } from './types/book';
import { 
  loadBooksFromStorage, 
  saveBooksToStorage, 
  loadGoalFromStorage, 
  saveGoalToStorage, 
  resetStorageToDefaults,
  buildReadChain 
} from './services/storage';

import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { BookCard } from './components/BookCard';
import { VisualBookGallery } from './components/VisualBookGallery';
import { ChapterMemoryLab } from './components/ChapterMemoryLab';
import { CompletionModal } from './components/CompletionModal';
import { ReadChainGraph } from './components/ReadChainGraph';
import { AnalyticsView } from './components/AnalyticsView';
import { AddBookModal } from './components/AddBookModal';

import { BookOpen, Filter, Plus } from 'lucide-react';

export default function App() {
  const [books, setBooks] = useState<Book[]>(loadBooksFromStorage);
  const [goal, setGoal] = useState<UserReadingGoal>(loadGoalFromStorage);

  const [activeTab, setActiveTab] = useState<'library' | 'gallery' | 'chapter-memory' | 'flow-chain' | 'analytics'>('library');
  const [activeShelf, setActiveShelf] = useState<ReadingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Target book for Chapter Memory Lab
  const [quizBookId, setQuizBookId] = useState<string | null>(null);

  // Modals state
  const [completionBook, setCompletionBook] = useState<Book | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sync books to storage
  useEffect(() => {
    saveBooksToStorage(books);
    
    const completedCount = books.filter(b => b.status === 'completed').length;
    if (completedCount !== goal.currentYearCount) {
      const updatedGoal = { ...goal, currentYearCount: completedCount };
      setGoal(updatedGoal);
      saveGoalToStorage(updatedGoal);
    }
  }, [books]);

  // Sync goal updates
  const handleUpdateGoalTarget = (newTarget: number) => {
    const updated = { ...goal, targetBooksYearly: newTarget };
    setGoal(updated);
    saveGoalToStorage(updated);
  };

  // Handle quiz score completion
  const handleCompleteQuiz = (scorePercent: number) => {
    const updatedGoal: UserReadingGoal = {
      ...goal,
      memoryQuizScoreTotal: (goal.memoryQuizScoreTotal || 0) + scorePercent,
      quizzesCompletedCount: (goal.quizzesCompletedCount || 0) + 1,
      streakDays: goal.streakDays + 1
    };
    setGoal(updatedGoal);
    saveGoalToStorage(updatedGoal);
  };

  // Add custom chapter question
  const handleAddCustomQuestion = (bookId: string, chapterNumber: number, question: QuizQuestion) => {
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        const quizzes = b.chapterQuizzes || [];
        const existingChap = quizzes.find(q => q.chapterNumber === chapterNumber);
        
        let updatedQuizzes;
        if (existingChap) {
          updatedQuizzes = quizzes.map(q => q.chapterNumber === chapterNumber 
            ? { ...q, questions: [...q.questions, question] }
            : q
          );
        } else {
          updatedQuizzes = [...quizzes, {
            chapterNumber,
            chapterTitle: `Chapter ${chapterNumber}`,
            summaryText: 'User defined chapter active recall quiz.',
            questions: [question]
          }];
        }
        return { ...b, chapterQuizzes: updatedQuizzes };
      }
      return b;
    }));
  };

  // Page progress update
  const handleUpdateProgress = (bookId: string, newPage: number) => {
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        const isNowFinished = newPage >= b.totalPages;
        return {
          ...b,
          currentPage: newPage,
          status: isNowFinished ? 'completed' : b.status,
          completedDate: isNowFinished ? (b.completedDate || new Date().toISOString().split('T')[0]) : b.completedDate
        };
      }
      return b;
    }));
  };

  // Delete book
  const handleDeleteBook = (bookId: string) => {
    setBooks(prev => prev.filter(b => b.id !== bookId));
  };

  // Trigger Completion Flow Modal
  const handleTriggerCompletionFlow = (book: Book) => {
    if (book.status !== 'completed') {
      setBooks(prev => prev.map(b => b.id === book.id ? { 
        ...b, 
        status: 'completed', 
        currentPage: b.totalPages,
        completedDate: new Date().toISOString().split('T')[0]
      } : b));
    }
    setCompletionBook(book);
  };

  // Save review & next read flow recommendation
  const handleSaveReviewAndSelectNext = (
    bookId: string,
    reviewData: {
      rating: number;
      favoriteQuote?: string;
      keyTakeaway?: string;
      selectedMoods: MoodTag[];
      chosenNextBookId?: string;
    },
    nextBookToStart?: Partial<Book>
  ) => {
    setBooks(prev => {
      let updated = prev.map(b => {
        if (b.id === bookId) {
          return {
            ...b,
            rating: reviewData.rating,
            completedDate: b.completedDate || new Date().toISOString().split('T')[0],
            review: {
              rating: reviewData.rating,
              completedDate: b.completedDate || new Date().toISOString().split('T')[0],
              favoriteQuote: reviewData.favoriteQuote,
              keyTakeaway: reviewData.keyTakeaway,
              selectedMoods: reviewData.selectedMoods,
              chosenNextBookId: reviewData.chosenNextBookId
            }
          };
        }
        return b;
      });

      if (nextBookToStart && nextBookToStart.id) {
        const existingIndex = updated.findIndex(b => b.id === nextBookToStart.id);
        if (existingIndex >= 0) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            status: nextBookToStart.status || 'currently-reading',
            previousBookId: bookId,
            flowConnectionReason: nextBookToStart.flowConnectionReason || 'Selected from Post-Read Flow',
            currentPage: nextBookToStart.status === 'currently-reading' ? (updated[existingIndex].currentPage || 1) : updated[existingIndex].currentPage
          };
        } else {
          const newFlowBook: Book = {
            id: nextBookToStart.id,
            title: nextBookToStart.title || 'New Recommended Read',
            author: nextBookToStart.author || 'Author',
            genre: nextBookToStart.genre || 'Sci-Fi',
            totalPages: nextBookToStart.totalPages || 300,
            currentPage: nextBookToStart.status === 'currently-reading' ? 1 : 0,
            status: nextBookToStart.status || 'currently-reading',
            format: 'paperback',
            coverGradient: nextBookToStart.coverGradient || 'from-indigo-600 to-purple-700',
            description: nextBookToStart.description || 'Discovered in post-read flow engine.',
            previousBookId: bookId,
            flowConnectionReason: nextBookToStart.flowConnectionReason || 'Post-read recommendation'
          };
          updated = [newFlowBook, ...updated];
        }
      }

      return updated;
    });

    setGoal(prev => ({
      ...prev,
      streakDays: prev.streakDays + 1,
      lastReadDate: new Date().toISOString().split('T')[0]
    }));
  };

  // Open Quiz tab for specific book
  const handleOpenChapterQuiz = (bookId: string) => {
    setQuizBookId(bookId);
    setActiveTab('chapter-memory');
  };

  // Add book
  const handleAddBook = (newBook: Book) => {
    setBooks(prev => [newBook, ...prev]);
  };

  // Reset defaults
  const handleResetDemo = () => {
    if (window.confirm('Reset library to default sample dataset?')) {
      const { books: defaultBooks, goal: defaultGoal } = resetStorageToDefaults();
      setBooks(defaultBooks);
      setGoal(defaultGoal);
    }
  };

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesShelf = activeShelf === 'all' || book.status === activeShelf;
      const matchesQuery = searchQuery === '' || 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesShelf && matchesQuery;
    });
  }, [books, activeShelf, searchQuery]);

  const readChain = useMemo(() => buildReadChain(books), [books]);

  return (
    <div className="min-h-screen pb-16">
      
      {/* Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        goal={goal}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onResetDemo={handleResetDemo}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
        
        {/* Aesthetic Hero Feature Banner */}
        <HeroBanner goal={goal} onNavigateTab={setActiveTab} />

        {/* Tab 1: My Library & Shelves */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            
            {/* Shelf Filter Bar */}
            <div className="flex items-center justify-between flex-wrap gap-3 glass-card rounded-2xl p-3 border border-slate-800">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-xs text-gray-500 font-semibold uppercase px-2 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Shelves:
                </span>

                {(['all', 'currently-reading', 'up-next', 'want-to-read', 'completed'] as const).map((shelf) => {
                  const count = shelf === 'all' 
                    ? books.length 
                    : books.filter(b => b.status === shelf).length;
                  return (
                    <button
                      key={shelf}
                      onClick={() => setActiveShelf(shelf)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                        activeShelf === shelf
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                          : 'bg-slate-900/60 text-gray-400 hover:text-gray-200 border border-slate-800'
                      }`}
                    >
                      {shelf.replace('-', ' ').toUpperCase()} ({count})
                    </button>
                  );
                })}
              </div>

              <span className="text-xs text-gray-400 font-medium px-2">
                Showing {filteredBooks.length} books
              </span>
            </div>

            {/* Book Cards Grid */}
            {filteredBooks.length === 0 ? (
              <div className="glass-card rounded-3xl p-12 text-center border border-slate-800 my-8">
                <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <h3 className="font-serif-book font-bold text-lg text-gray-300">No books found in this shelf</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your search query or add a new book to your reading tracker.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Book
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onUpdateProgress={handleUpdateProgress}
                    onTriggerCompletionFlow={handleTriggerCompletionFlow}
                    onOpenChapterQuiz={handleOpenChapterQuiz}
                    onDeleteBook={handleDeleteBook}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Visual Book Gallery */}
        {activeTab === 'gallery' && (
          <VisualBookGallery
            books={books}
            onOpenChapterQuiz={handleOpenChapterQuiz}
            onTriggerCompletionFlow={handleTriggerCompletionFlow}
          />
        )}

        {/* Tab 3: Chapter Memory Boost Lab */}
        {activeTab === 'chapter-memory' && (
          <ChapterMemoryLab
            books={books}
            initialBookId={quizBookId}
            onCompleteQuiz={handleCompleteQuiz}
            onAddCustomQuestion={handleAddCustomQuestion}
          />
        )}

        {/* Tab 4: Visual Post-Read Flow Chain Graph */}
        {activeTab === 'flow-chain' && (
          <ReadChainGraph
            books={books}
            readChain={readChain}
            onSelectBook={(b) => {
              setActiveTab('library');
              setSearchQuery(b.title);
            }}
          />
        )}

        {/* Tab 5: Reading Analytics */}
        {activeTab === 'analytics' && (
          <AnalyticsView
            books={books}
            goal={goal}
            onUpdateGoal={handleUpdateGoalTarget}
          />
        )}

      </main>

      {/* Completion Flow Modal */}
      {completionBook && (
        <CompletionModal
          book={completionBook}
          allBooks={books}
          onClose={() => setCompletionBook(null)}
          onSaveReviewAndSelectNext={handleSaveReviewAndSelectNext}
        />
      )}

      {/* Add Book Modal */}
      {isAddModalOpen && (
        <AddBookModal
          onClose={() => setIsAddModalOpen(false)}
          onAddBook={handleAddBook}
        />
      )}

    </div>
  );
}
