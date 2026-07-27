import React, { useState } from 'react';
import type { Book } from '../types/book';
import { Brain, GitBranch, Eye } from 'lucide-react';

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
      <div className="glass-card rounded-3xl p-6 border border-gray-200 bg-white/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-gray-100 border border-gray-300 text-black text-xs font-semibold mb-2">
            Artwork & Covers
          </span>
          <h2 className="font-cinzel text-2xl lg:text-3xl font-bold text-black">
            Visual Gallery
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Browse cover artwork and launch chapter quizzes directly.
          </p>
        </div>

        {/* Genre Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
          <button
            onClick={() => setSelectedGenre('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedGenre === 'all'
                ? 'bg-black text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
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
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
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
              className="glass-card rounded-3xl overflow-hidden border border-gray-200 hover:border-black transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-64 w-full bg-gray-100 overflow-hidden cursor-pointer" onClick={() => setActivePreviewBook(book)}>
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${book.coverGradient} flex flex-col justify-between p-5 text-white group-hover:scale-105 transition-transform duration-500`}>
                      <span className="text-xs uppercase font-semibold opacity-90">{book.genre}</span>
                      <div className="my-auto text-center">
                        <h3 className="font-serif-book font-bold text-xl drop-shadow">{book.title}</h3>
                        <p className="text-xs opacity-90 mt-1 font-medium">{book.author}</p>
                      </div>
                      <span className="text-xs text-right opacity-80">{book.totalPages} pgs</span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-wider">
                      {book.genre}
                    </span>

                    {book.chapterQuizzes && book.chapterQuizzes.length > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-white text-black border border-gray-300 text-[10px] font-bold flex items-center gap-1 shadow-xs">
                        <Brain className="w-3 h-3 text-black" /> Quiz
                      </span>
                    )}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <button className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs flex items-center gap-1.5 shadow-md">
                      <Eye className="w-4 h-4" /> Quick Preview
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-serif-book font-bold text-base text-black group-hover:text-gray-700 transition-colors line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-600 font-medium">by {book.author}</p>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{book.description}</p>

                  <div className="pt-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 mb-1">
                      <span>Progress</span>
                      <span className="text-black font-bold">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-gray-100 flex items-center gap-2 mt-2">
                {book.chapterQuizzes && book.chapterQuizzes.length > 0 && (
                  <button
                    onClick={() => onOpenChapterQuiz(book.id)}
                    className="flex-1 py-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-300 text-black font-bold text-[11px] flex items-center justify-center gap-1 transition-all"
                  >
                    <Brain className="w-3.5 h-3.5" /> Quiz
                  </button>
                )}

                <button
                  onClick={() => onTriggerCompletionFlow(book)}
                  className="flex-1 py-2 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-all"
                >
                  <GitBranch className="w-3.5 h-3.5 stroke-[2.5]" /> Flow
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Book Preview Modal */}
      {activePreviewBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="glass-modal rounded-3xl max-w-xl w-full p-6 relative border border-gray-300 text-gray-900 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-5">
              <div className="w-36 h-48 rounded-2xl overflow-hidden flex-shrink-0 shadow border border-gray-300">
                {activePreviewBook.coverImage ? (
                  <img src={activePreviewBook.coverImage} alt={activePreviewBook.title} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${activePreviewBook.coverGradient} p-4 text-white flex flex-col justify-between`}>
                    <span className="text-xs uppercase">{activePreviewBook.genre}</span>
                    <h4 className="font-serif-book font-bold text-base">{activePreviewBook.title}</h4>
                    <span className="text-xs">{activePreviewBook.author}</span>
                  </div>
                )}
              </div>

              <div className="flex-grow space-y-2">
                <span className="text-xs uppercase font-bold text-gray-500">{activePreviewBook.genre}</span>
                <h3 className="font-serif-book font-bold text-xl text-black">{activePreviewBook.title}</h3>
                <p className="text-xs font-semibold text-gray-600">by {activePreviewBook.author}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{activePreviewBook.description}</p>

                <div className="pt-3 flex items-center gap-3">
                  {activePreviewBook.chapterQuizzes && (
                    <button
                      onClick={() => {
                        const id = activePreviewBook.id;
                        setActivePreviewBook(null);
                        onOpenChapterQuiz(id);
                      }}
                      className="px-4 py-2 rounded-xl bg-black text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <Brain className="w-4 h-4" /> Start Chapter Quiz
                    </button>
                  )}
                  <button
                    onClick={() => setActivePreviewBook(null)}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 font-semibold text-xs"
                  >
                    Close
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
