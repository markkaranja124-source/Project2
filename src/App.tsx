import { useState, useEffect, useMemo } from 'react';
import type { Book, ReadingStatus, UserReadingGoal, MoodTag } from './types/book';
import { 
  loadBooksFromStorage, 
  saveBooksToStorage, 
  loadGoalFromStorage, 
  saveGoalToStorage, 
  resetStorageToDefaults,
  buildReadChain 
} from './services/storage';

import { Header } from './components/Header';
import { BookCard } from './components/BookCard';
import { CompletionModal } from './components/CompletionModal';
import { ReadChainGraph } from './components/ReadChainGraph';
import { AnalyticsView } from './components/AnalyticsView';
import { AddBookModal } from './components/AddBookModal';

import { BookOpen, Filter, Plus } from 'lucide-react';

export default function App() {
  const [books, setBooks] = useState<Book[]>(loadBooksFromStorage);
  const [goal, setGoal] = useState<UserReadingGoal>(loadGoalFromStorage);

  const [activeTab, setActiveTab] = useState<'library' | 'flow-chain' | 'analytics'>('library');
  const [activeShelf, setActiveShelf] = useState<ReadingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [completionBook, setCompletionBook] = useState<Book | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sync books to storage on state change
  useEffect(() => {
    saveBooksToStorage(books);
    
    // Update goal completed count based on books
    const completedCount = books.filter(b => b.status === 'completed').length;
    if (completedCount !== goal.currentYearCount) {
      const updatedGoal = { ...goal, currentYearCount: completedCount };
      setGoal(updatedGoal);
      saveGoalToStorage(updatedGoal);
    }
  }, [books]);

  // Sync goal changes to storage
  const handleUpdateGoalTarget = (newTarget: number) => {
    const updated = { ...goal, targetBooksYearly: newTarget };
    setGoal(updated);
    saveGoalToStorage(updated);
  };

  // Handler for progress updates
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

  // Handler for manual status changes
  const handleStatusChange = (bookId: string, status: ReadingStatus) => {
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, status } : b));
  };

  // Delete book handler
  const handleDeleteBook = (bookId: string) => {
    setBooks(prev => prev.filter(b => b.id !== bookId));
  };

  // Trigger Post-Read Completion Flow Modal
  const handleTriggerCompletionFlow = (book: Book) => {
    // Automatically set book as completed if not already
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

  // Save review & process chosen recommendation flow
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

      // If user selected a next book recommendation to start or queue
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
          // Create new book entry from recommendation
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

    // Boost reading streak
    setGoal(prev => ({
      ...prev,
      streakDays: prev.streakDays + 1,
      lastReadDate: new Date().toISOString().split('T')[0]
    }));
  };

  // Add new book handler
  const handleAddBook = (newBook: Book) => {
    setBooks(prev => [newBook, ...prev]);
  };

  // Reset to default sample dataset
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
      
      {/* Header Bar */}
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
        
        {/* Tab 1: Library & Shelves */}
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
                    onStatusChange={handleStatusChange}
                    onTriggerCompletionFlow={handleTriggerCompletionFlow}
                    onDeleteBook={handleDeleteBook}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Visual Post-Read Flow Chain Graph */}
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

        {/* Tab 3: Reading Analytics */}
        {activeTab === 'analytics' && (
          <AnalyticsView
            books={books}
            goal={goal}
            onUpdateGoal={handleUpdateGoalTarget}
          />
        )}

      </main>

      {/* Completion Modal Trigger */}
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
