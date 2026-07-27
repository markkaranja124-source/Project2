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
      case 'audiobook': return <Headphones className="w-3.5 h-3.5 text-purple-400" />;
      case 'ebook': return <Tablet className="w-3.5 h-3.5 text-cyan-400" />;
      case 'hardcover': return <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />;
      default: return <BookOpen className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const getStatusBadge = (status: ReadingStatus) => {
    switch (status) {
      case 'currently-reading':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-medium flex items-center gap-1">
            <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
            Reading
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Finished
          </span>
        );
      case 'up-next':
        return (
          <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-medium">
            Up Next
          </span>
        );
      case 'want-to-read':
        return (
          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-gray-400 border border-slate-700 text-xs font-medium">
            Want to Read
          </span>
        );
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 lg:p-5 flex flex-col md:flex-row gap-5 hover:border-slate-600/60 transition-all duration-300 group">
      
      {/* 3D Book Cover Graphic or Image */}
      <div className="relative flex-shrink-0 self-center md:self-start">
        {book.coverImage ? (
          <div className="w-32 h-44 lg:w-36 lg:h-52 rounded-xl overflow-hidden shadow-xl border border-slate-700 book-cover-3d relative">
            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover object-center" />
            <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs rounded px-1.5 py-0.5 text-[9px] text-amber-200 text-center font-bold">
              {book.genre}
            </div>
          </div>
        ) : (
          <div 
            className={`w-32 h-44 lg:w-36 lg:h-52 rounded-xl bg-gradient-to-br ${book.coverGradient} book-cover-3d flex flex-col justify-between p-3.5 text-white overflow-hidden select-none`}
          >
            <div className="flex items-center justify-between text-xs opacity-90">
              <span className="font-semibold tracking-wider uppercase text-[10px] bg-black/30 px-1.5 py-0.5 rounded backdrop-blur-sm">
                {book.genre}
              </span>
              <span className="text-lg">{book.coverEmoji || '📖'}</span>
            </div>

            <div className="my-auto z-10 text-center px-1">
              <h3 className="font-serif-book font-bold text-base lg:text-lg leading-snug drop-shadow-md line-clamp-3">
                {book.title}
              </h3>
              <p className="text-xs opacity-90 mt-1 font-sans font-medium drop-shadow text-amber-100">
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
          <div className="mt-2 text-[10px] text-purple-300 bg-purple-950/60 border border-purple-500/30 rounded-lg px-2 py-1 flex items-center gap-1 max-w-[140px] truncate" title={book.flowConnectionReason}>
            <GitBranch className="w-3 h-3 text-purple-400 flex-shrink-0" />
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
              <div className="flex items-center gap-1 text-xs text-gray-400 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-800">
                {getFormatIcon(book.format)}
                <span className="capitalize">{book.format}</span>
              </div>
            </div>

            <button
              onClick={() => onDeleteBook(book.id)}
              className="text-gray-500 hover:text-red-400 p-1 rounded-lg hover:bg-slate-800/80 transition-colors"
              title="Delete book"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <h2 className="font-serif-book text-xl lg:text-2xl font-bold text-gray-100 group-hover:text-amber-300 transition-colors">
            {book.title}
          </h2>
          <p className="text-sm font-medium text-amber-400/90 mb-2">
            by {book.author}
          </p>

          <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
            {book.description}
          </p>

          {book.status === 'completed' && book.rating && (
            <div className="mb-3 flex items-center gap-3 bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-2.5">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < (book.rating || 0)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              {book.review?.favoriteQuote && (
                <p className="text-xs text-emerald-200 italic line-clamp-1 border-l border-emerald-500/30 pl-2.5">
                  "{book.review.favoriteQuote}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Progress & Quick Actions */}
        <div className="mt-2 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-gray-400 font-medium">Reading Progress</span>
            <div className="flex items-center gap-2 font-semibold">
              {isEditingPage ? (
                <form onSubmit={handlePageSubmit} className="flex items-center gap-1">
                  <input
                    type="number"
                    value={inputPage}
                    onChange={(e) => setInputPage(e.target.value)}
                    className="w-16 bg-slate-900 border border-amber-500 rounded px-1.5 py-0.5 text-xs text-white text-right focus:outline-none"
                    autoFocus
                    onBlur={handlePageSubmit}
                  />
                  <span className="text-gray-400">/ {book.totalPages} pgs</span>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setInputPage(book.currentPage.toString());
                    setIsEditingPage(true);
                  }}
                  className="hover:text-amber-300 underline decoration-dashed transition-colors"
                >
                  {book.currentPage} / {book.totalPages} pgs ({progressPercent}%)
                </button>
              )}
            </div>
          </div>

          <div className="relative w-full h-2.5 bg-slate-900 rounded-full overflow-hidden mb-3 border border-slate-800">
            <div
              className={`h-full transition-all duration-500 ${
                book.status === 'completed'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            {book.status !== 'completed' ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleQuickAdd(25)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-amber-500/20 hover:border-amber-500/40 border border-slate-700/60 text-xs font-semibold text-gray-300 hover:text-amber-300 transition-all flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                  +25 pgs
                </button>
                <button
                  onClick={() => handleQuickAdd(50)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-amber-500/20 hover:border-amber-500/40 border border-slate-700/60 text-xs font-semibold text-gray-300 hover:text-amber-300 transition-all flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                  +50 pgs
                </button>
              </div>
            ) : (
              <div className="text-xs text-emerald-400 font-medium">
                Finished on {book.completedDate || 'Recently'}
              </div>
            )}

            <div className="flex items-center gap-2 ml-auto">
              {book.chapterQuizzes && onOpenChapterQuiz && (
                <button
                  onClick={() => onOpenChapterQuiz(book.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-semibold transition-all"
                  title="Test memory with active recall quiz"
                >
                  <Brain className="w-3.5 h-3.5 text-purple-400" />
                  <span>Chapter Quiz</span>
                </button>
              )}

              <button
                onClick={() => onTriggerCompletionFlow(book)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Next Read Flow</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
