import React, { useState } from 'react';
import type { Book } from '../types/book';
import { BookOpen, Brain, Star, GitBranch, Eye } from 'lucide-react';

interface VisualBookGalleryProps {
  books: Book[];
  onOpenChapterQuiz: (bookId: string) => void;
  onTriggerCompletionFlow: (book: Book) => void;
}

export const VisualBookGallery: React.FC<VisualBookGalleryProps> = ({
  books,
  onOpenChapterQuiz,
  onTriggerCompletionFlow,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [activePreviewBook, setActivePreviewBook] = useState<Book | null>(null);

  const genres = Array.from(new Set(books.map(b => b.genre)));

  const filteredBooks = books.filter(b => {
    if (selectedGenre === 'all') return true;
    return b.genre === selectedGenre;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 border border-amber-500/20 bg-gradient-to-r from-amber-950/30 via-slate-900 to-orange-950/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>High-Definition Visual Library</span>
          </div>
          <h2 className="font-cinzel text-2xl lg:text-3xl font-bold gradient-text-gold">
            Visual Book Showcase & Artwork Gallery
          </h2>
          <p className="text-sm text-gray-300 mt-1 max-w-2xl">
            Browse all books in high definition with cover artwork images, page counts, active chapter quizzes, and post-read flow options.
          </p>
        </div>

        {/* Genre Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
          <button
            onClick={() => setSelectedGenre('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedGenre === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-gray-400 hover:text-gray-200 border border-slate-800'
            }`}
          >
            All ({books.length})
          </button>
          {genres.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedGenre === g
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-gray-400 hover:text-gray-200 border border-slate-800'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => {
          const progressPercent = Math.min(100, Math.round((book.currentPage / book.totalPages) * 100));

          return (
            <div
              key={book.id}
              className="glass-card rounded-3xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Book Cover Artwork Image or 3D Gradient */}
                <div className="relative h-64 w-full bg-slate-950 overflow-hidden cursor-pointer" onClick={() => setActivePreviewBook(book)}>
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${book.coverGradient} flex flex-col justify-between p-5 text-white group-hover:scale-105 transition-transform duration-500`}>
                      <span className="text-xs uppercase tracking-wider font-semibold opacity-90">{book.genre}</span>
                      <div className="my-auto text-center">
                        <h3 className="font-serif-book font-bold text-xl drop-shadow-md">{book.title}</h3>
                        <p className="text-xs opacity-90 mt-1 font-medium">{book.author}</p>
                      </div>
                      <span className="text-xs text-right opacity-80">{book.totalPages} pgs</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  {/* Top Status & Chapter Quiz Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                      {book.genre}
                    </span>

                    {book.chapterQuizzes && book.chapterQuizzes.length > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 backdrop-blur-md border border-purple-500/40 text-[10px] font-bold text-purple-300 flex items-center gap-1">
                        <Brain className="w-3 h-3 text-purple-400" /> Quiz Active
                      </span>
                    )}
                  </div>

                  {/* Hover Quick View Eye Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                    <button className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-4 h-4" /> Quick Preview
                    </button>
                  </div>
                </div>

                {/* Card Information */}
                <div className="p-4 space-y-2">
                  <h3 className="font-serif-book font-bold text-base text-gray-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-amber-400/90 font-medium">by {book.author}</p>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{book.description}</p>

                  {/* Progress Bar */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 mb-1">
                      <span>Progress</span>
                      <span className="text-amber-300">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Strip */}
              <div className="p-4 pt-0 border-t border-slate-800/80 flex items-center gap-2 mt-2">
                {book.chapterQuizzes && book.chapterQuizzes.length > 0 && (
                  <button
                    onClick={() => onOpenChapterQuiz(book.id)}
                    className="flex-1 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 font-bold text-[11px] flex items-center justify-center gap-1 transition-all"
                  >
                    <Brain className="w-3.5 h-3.5 text-purple-400" /> Quiz
                  </button>
                )}

                <button
                  onClick={() => onTriggerCompletionFlow(book)}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1 transition-all"
                >
                  <GitBranch className="w-3.5 h-3.5 stroke-[2.5]" /> Flow
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Book Preview Detail Modal */}
      {activePreviewBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-modal rounded-3xl max-w-2xl w-full p-6 relative border border-amber-500/30 text-gray-100">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-40 h-56 rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl border border-slate-700">
                {activePreviewBook.coverImage ? (
                  <img src={activePreviewBook.coverImage} alt={activePreviewBook.title} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${activePreviewBook.coverGradient} p-4 text-white flex flex-col justify-between`}>
                    <span className="text-xs uppercase">{activePreviewBook.genre}</span>
                    <h4 className="font-serif-book font-bold text-lg">{activePreviewBook.title}</h4>
                    <span className="text-xs">{activePreviewBook.author}</span>
                  </div>
                )}
              </div>

              <div className="flex-grow space-y-3">
                <span className="text-xs uppercase font-bold text-amber-400">{activePreviewBook.genre}</span>
                <h3 className="font-serif-book font-bold text-2xl text-gray-100">{activePreviewBook.title}</h3>
                <p className="text-sm font-semibold text-amber-400/90">by {activePreviewBook.author}</p>
                <p className="text-xs text-gray-300 leading-relaxed">{activePreviewBook.description}</p>
                
                {activePreviewBook.rating && (
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < activePreviewBook.rating! ? 'fill-amber-400' : 'text-slate-700'}`} />
                    ))}
                  </div>
                )}

                <div className="pt-4 flex items-center gap-3">
                  {activePreviewBook.chapterQuizzes && (
                    <button
                      onClick={() => {
                        const id = activePreviewBook.id;
                        setActivePreviewBook(null);
                        onOpenChapterQuiz(id);
                      }}
                      className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <Brain className="w-4 h-4" /> Start Chapter Memory Quiz
                    </button>
                  )}
                  <button
                    onClick={() => setActivePreviewBook(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-gray-300 font-semibold text-xs"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
