import React, { useState } from 'react';
import type { Book, ReadChainNode } from '../types/book';
import { GitFork, Star, Sparkles, Quote, CheckCircle2, Clock } from 'lucide-react';

interface ReadChainGraphProps {
  books: Book[];
  readChain: ReadChainNode[];
  onSelectBook: (book: Book) => void;
}

export const ReadChainGraph: React.FC<ReadChainGraphProps> = ({
  books,
  readChain,
  onSelectBook,
}) => {
  const [selectedChainNodeId, setSelectedChainNodeId] = useState<string | null>(
    readChain.length > 0 ? readChain[readChain.length - 1].id : null
  );

  const selectedNode = readChain.find(n => n.id === selectedChainNodeId);
  const selectedBook = selectedNode ? books.find(b => b.id === selectedNode.bookId) : null;
  const currentlyReading = books.filter(b => b.status === 'currently-reading');

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200 bg-white/90 shadow-sm">
        <span className="inline-block px-3 py-1 rounded-full bg-gray-100 border border-gray-300 text-black text-xs font-semibold mb-2">
          Flow Chain
        </span>
        <h2 className="font-cinzel text-2xl lg:text-3xl font-bold text-black">
          Read Flow Chain
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Visual sequence showing how each book connected to your next read.
        </p>
      </div>

      {/* Main Node Chain */}
      <div className="glass-card rounded-3xl p-6 lg:p-8 overflow-x-auto border border-gray-200 bg-white/90">
        <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-6 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-black" />
          Sequential Read Chain ({readChain.length} Books)
        </h3>

        {readChain.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <GitFork className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-sm text-gray-600">No completed books in chain yet.</p>
          </div>
        ) : (
          <div className="flex items-center gap-6 min-w-max pb-4 px-2">
            {readChain.map((node, index) => {
              const isSelected = node.id === selectedChainNodeId;
              const isLast = index === readChain.length - 1;

              return (
                <React.Fragment key={node.id}>
                  
                  <div
                    onClick={() => setSelectedChainNodeId(node.id)}
                    className={`group relative flex flex-col items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                      isSelected
                        ? 'bg-black text-white border-black ring-2 ring-black shadow-lg scale-105'
                        : 'bg-white border-gray-200 text-black hover:border-black hover:bg-gray-50'
                    }`}
                  >
                    <span className={`absolute -top-3 left-4 px-2 py-0.5 rounded-full text-[10px] font-bold ${isSelected ? 'bg-white text-black' : 'bg-black text-white'}`}>
                      #{index + 1}
                    </span>

                    <div className={`w-20 h-28 rounded-lg bg-gradient-to-br ${node.coverGradient} shadow-md flex flex-col justify-between p-2 text-white my-2 group-hover:scale-105 transition-transform`}>
                      <div className="text-[9px] uppercase tracking-wider opacity-80">Read</div>
                      <div className="font-serif-book font-bold text-xs leading-tight line-clamp-3 text-center drop-shadow">
                        {node.title}
                      </div>
                      <div className="flex justify-end">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    </div>

                    <div className="text-center mt-1">
                      <h4 className={`font-serif-book font-bold text-xs max-w-[110px] truncate ${isSelected ? 'text-white' : 'text-black'}`}>
                        {node.title}
                      </h4>
                      <p className={`text-[10px] max-w-[110px] truncate ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                        {node.author}
                      </p>
                      
                      <div className="flex items-center justify-center gap-0.5 mt-1.5 text-black">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < node.rating ? (isSelected ? 'fill-white text-white' : 'fill-black text-black') : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                  </div>

                  {(!isLast || currentlyReading.length > 0) && (
                    <div className="flex flex-col items-center justify-center px-2">
                      {node.reasonToNext ? (
                        <span className="text-[10px] font-semibold text-black bg-gray-100 border border-gray-300 px-2.5 py-1 rounded-full shadow-xs max-w-[140px] text-center truncate mb-1" title={node.reasonToNext}>
                          {node.reasonToNext}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-gray-500 mb-1">
                          Flowed
                        </span>
                      )}

                      <div className="flex items-center text-black">
                        <svg className="w-16 h-6" viewBox="0 0 64 24">
                          <line
                            x1="0"
                            y1="12"
                            x2="52"
                            y2="12"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="flow-line-animated"
                          />
                          <polygon points="52,6 64,12 52,18" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                  )}

                </React.Fragment>
              );
            })}

            {currentlyReading.map((b) => (
              <div
                key={`reading-${b.id}`}
                onClick={() => onSelectBook(b)}
                className="flex flex-col items-center p-4 rounded-2xl bg-gray-100 border border-gray-300 cursor-pointer hover:border-black transition-all"
              >
                <span className="px-2.5 py-0.5 rounded-full bg-black text-white text-[10px] font-bold mb-2 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-white" />
                  Reading Now
                </span>

                <div className={`w-20 h-28 rounded-lg bg-gradient-to-br ${b.coverGradient} shadow-md flex flex-col justify-between p-2 text-white my-1`}>
                  <div className="text-[9px] uppercase tracking-wider opacity-80">Active</div>
                  <div className="font-serif-book font-bold text-xs leading-tight line-clamp-3 text-center drop-shadow">
                    {b.title}
                  </div>
                  <div className="text-[9px] text-white text-right font-sans font-bold">
                    {Math.round((b.currentPage / b.totalPages) * 100)}%
                  </div>
                </div>

                <h4 className="font-serif-book font-bold text-xs text-black max-w-[110px] truncate text-center mt-1">
                  {b.title}
                </h4>
                <p className="text-[10px] text-gray-500 max-w-[110px] truncate text-center">
                  {b.author}
                </p>
              </div>
            ))}

          </div>
        )}
      </div>

      {selectedBook && (
        <div className="glass-card rounded-3xl p-6 border border-gray-200 bg-white flex flex-col md:flex-row gap-6">
          <div className={`w-32 h-44 rounded-xl bg-gradient-to-br ${selectedBook.coverGradient} flex-shrink-0 flex flex-col justify-between p-3.5 text-white shadow-md`}>
            <span className="text-xs uppercase font-semibold opacity-80">{selectedBook.genre}</span>
            <h4 className="font-serif-book font-bold text-base line-clamp-3 drop-shadow">
              {selectedBook.title}
            </h4>
            <span className="text-xs text-gray-100">{selectedBook.author}</span>
          </div>

          <div className="flex-grow space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-xs uppercase font-bold text-gray-500">
                  Node Inspection
                </span>
                <h3 className="font-serif-book text-xl font-bold text-black">
                  {selectedBook.title}
                </h3>
              </div>

              {selectedBook.completedDate && (
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-black border border-gray-300 font-semibold">
                  Completed {selectedBook.completedDate}
                </span>
              )}
            </div>

            {selectedBook.review?.favoriteQuote && (
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs italic text-gray-800 flex items-start gap-2">
                <Quote className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                <span>"{selectedBook.review.favoriteQuote}"</span>
              </div>
            )}

            {selectedBook.review?.keyTakeaway && (
              <div>
                <span className="text-xs font-bold text-black block mb-1">Key Takeaway</span>
                <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-200">
                  {selectedBook.review.keyTakeaway}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
