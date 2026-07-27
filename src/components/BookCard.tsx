import React, { useState } from 'react';
import type { Book, ReadingStatus } from '../types/book';
import { 
  Star, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  GitBranch, 
  Trash2, 
  PlusCircle, 
  Headphones, 
  Tablet, 
  BookmarkCheck,
  Brain
} from 'lucide-react';

interface BookCardProps {
  book: Book;
  onUpdateProgress: (bookId: string, newPage: number) => void;
  onTriggerCompletionFlow: (book: Book) => void;
  onOpenChapterQuiz?: (bookId: string) => void;
  onDeleteBook: (bookId: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onUpdateProgress,
  onTriggerCompletionFlow,
  onOpenChapterQuiz,
  onDeleteBook,
}) => {
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [inputPage, setInputPage] = useState(book.currentPage.toString());

  const progressPercent = Math.min(
    100,
    Math.round((book.currentPage / book.totalPages) * 100)
  );

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(inputPage, 10);
    if (!isNaN(val)) {
      const newPage = Math.max(0, Math.min(book.totalPages, val));
      onUpdateProgress(book.id, newPage);
      if (newPage >= book.totalPages && book.status !== 'completed') {
        onTriggerCompletionFlow(book);
      }
    }
    setIsEditingPage(false);
  };

  const handleQuickAdd = (pagesToAdd: number) => {
    const newPage = Math.min(book.totalPages, book.currentPage + pagesToAdd);
    onUpdateProgress(book.id, newPage);
    setInputPage(newPage.toString());
    if (newPage >= book.totalPages && book.status !== 'completed') {
      onTriggerCompletionFlow(book);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'audiobook': return <Headphones className="w-3.5 h-3.5 text-gray-700" />;
      case 'ebook': return <Tablet className="w-3.5 h-3.5 text-gray-700" />;
      case 'hardcover': return <BookmarkCheck className="w-3.5 h-3.5 text-gray-700" />;
      default: return <BookOpen className="w-3.5 h-3.5 text-gray-700" />;
    }
  };

  const getStatusBadge = (status: ReadingStatus) => {
    switch (status) {
      case 'currently-reading':
        return (
          <span className="px-2.5 py-1 rounded-full bg-black text-white text-xs font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3 text-white" />
            Reading
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full bg-gray-200 text-gray-900 border border-gray-300 text-xs font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-black" />
            Finished
          </span>
        );
      case 'up-next':
        return (
          <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-300 text-xs font-semibold">
            Up Next
          </span>
        );
      case 'want-to-read':
        return (
          <span className="px-2.5 py-1 rounded-full bg-white text-gray-600 border border-gray-300 text-xs font-semibold">
            Want to Read
          </span>
        );
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 lg:p-5 flex flex-col md:flex-row gap-5 hover:border-gray-400 transition-all duration-300 group">
      
      {/* 3D Book Cover Graphic or Image */}
      <div className="relative flex-shrink-0 self-center md:self-start">
        {book.coverImage ? (
          <div className="w-32 h-44 lg:w-36 lg:h-52 rounded-xl overflow-hidden shadow-md border border-gray-300 book-cover-3d relative">
            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover object-center" />
            <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-xs rounded px-1.5 py-0.5 text-[9px] text-black text-center font-bold border border-gray-200">
              {book.genre}
            </div>
          </div>
        ) : (
          <div 
            className={`w-32 h-44 lg:w-36 lg:h-52 rounded-xl bg-gradient-to-br ${book.coverGradient} book-cover-3d flex flex-col justify-between p-3.5 text-white overflow-hidden select-none`}
          >
            <div className="flex items-center justify-between text-xs opacity-90">
              <span className="font-semibold tracking-wider uppercase text-[10px] bg-black/40 px-1.5 py-0.5 rounded">
                {book.genre}
              </span>
              <span className="text-lg">{book.coverEmoji || '📖'}</span>
            </div>

            <div className="my-auto z-10 text-center px-1">
              <h3 className="font-serif-book font-bold text-base lg:text-lg leading-snug drop-shadow text-white">
                {book.title}
              </h3>
              <p className="text-xs opacity-90 mt-1 font-sans font-medium text-gray-200">
                {book.author}
              </p>
            </div>

            <div className="flex items-center justify-between text-[10px] opacity-85 z-10 pt-1 border-t border-white/20">
              <span className="capitalize">{book.format}</span>
              <span>{book.totalPages} pgs</span>
            </div>
          </div>
        )}

        {book.flowConnectionReason && (
          <div className="mt-2 text-[10px] text-gray-800 bg-gray-100 border border-gray-300 rounded-lg px-2 py-1 flex items-center gap-1 max-w-[140px] truncate" title={book.flowConnectionReason}>
            <GitBranch className="w-3 h-3 text-black flex-shrink-0" />
            <span className="truncate">{book.flowConnectionReason}</span>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
            <div className="flex items-center gap-2">
              {getStatusBadge(book.status)}
              <div className="flex items-center gap-1 text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                {getFormatIcon(book.format)}
                <span className="capitalize">{book.format}</span>
              </div>
            </div>

            <button
              onClick={() => onDeleteBook(book.id)}
              className="text-gray-400 hover:text-red-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              title="Delete book"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <h2 className="font-serif-book text-xl font-bold text-black group-hover:text-gray-700 transition-colors">
            {book.title}
          </h2>
          <p className="text-sm font-semibold text-gray-600 mb-2">
            by {book.author}
          </p>

          <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
            {book.description}
          </p>

          {book.status === 'completed' && book.rating && (
            <div className="mb-3 flex items-center gap-3 bg-gray-100 border border-gray-200 rounded-xl p-2.5">
              <div className="flex items-center gap-1 text-black">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < (book.rating || 0)
                        ? 'fill-black text-black'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              {book.review?.favoriteQuote && (
                <p className="text-xs text-gray-700 italic line-clamp-1 border-l border-gray-300 pl-2.5">
                  "{book.review.favoriteQuote}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Progress & Quick Actions */}
        <div className="mt-2 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-gray-500">Progress</span>
            <div className="flex items-center gap-2 font-bold text-black">
              {isEditingPage ? (
                <form onSubmit={handlePageSubmit} className="flex items-center gap-1">
                  <input
                    type="number"
                    value={inputPage}
                    onChange={(e) => setInputPage(e.target.value)}
                    className="w-16 bg-white border border-black rounded px-1.5 py-0.5 text-xs text-black text-right focus:outline-none"
                    autoFocus
                    onBlur={handlePageSubmit}
                  />
                  <span className="text-gray-500">/ {book.totalPages} pgs</span>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setInputPage(book.currentPage.toString());
                    setIsEditingPage(true);
                  }}
                  className="hover:underline transition-colors"
                >
                  {book.currentPage} / {book.totalPages} pgs ({progressPercent}%)
                </button>
              )}
            </div>
          </div>

          <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-black transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            {book.status !== 'completed' ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleQuickAdd(25)}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 text-xs font-semibold text-gray-800 transition-all flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-black" />
                  +25 pgs
                </button>
                <button
                  onClick={() => handleQuickAdd(50)}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 text-xs font-semibold text-gray-800 transition-all flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-black" />
                  +50 pgs
                </button>
              </div>
            ) : (
              <div className="text-xs text-gray-700 font-semibold">
                Finished on {book.completedDate || 'Recently'}
              </div>
            )}

            <div className="flex items-center gap-2 ml-auto">
              {book.chapterQuizzes && onOpenChapterQuiz && (
                <button
                  onClick={() => onOpenChapterQuiz(book.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 border border-gray-300 text-black text-xs font-semibold shadow-xs transition-all"
                  title="Chapter Quiz"
                >
                  <Brain className="w-3.5 h-3.5 text-black" />
                  <span>Quiz</span>
                </button>
              )}

              <button
                onClick={() => onTriggerCompletionFlow(book)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Next Flow</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
