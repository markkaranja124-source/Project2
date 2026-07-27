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

  // Currently reading books to show at the tip of the flow
  const currentlyReading = books.filter(b => b.status === 'currently-reading');

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
            <GitFork className="w-4 h-4 text-purple-400" />
            <span>Interactive Sequential Flow Graph</span>
          </div>
          <h2 className="font-cinzel text-2xl lg:text-3xl font-bold gradient-text-purple">
            Your Book Reading Flow Chain
          </h2>
          <p className="text-sm text-gray-300 mt-2 leading-relaxed">
            Visualize how each completed book inspired your next read. This interactive chain maps your personal reader journey, showing theme connections and post-read flow transitions.
          </p>
        </div>
      </div>

      {/* Main Flow Chain Node Ribbon */}
      <div className="glass-card rounded-3xl p-6 lg:p-8 overflow-x-auto">
        <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-6 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Sequential Read Chain ({readChain.length} Books Flowed)
        </h3>

        {readChain.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <GitFork className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="font-medium text-sm">No completed books in your flow chain yet.</p>
            <p className="text-xs text-gray-500 mt-1">Mark a book as finished to start building your sequential read flow!</p>
          </div>
        ) : (
          <div className="flex items-center gap-6 min-w-max pb-4 px-2">
            {readChain.map((node, index) => {
              const isSelected = node.id === selectedChainNodeId;
              const isLast = index === readChain.length - 1;

              return (
                <React.Fragment key={node.id}>
                  
                  {/* Book Flow Node Card */}
                  <div
                    onClick={() => setSelectedChainNodeId(node.id)}
                    className={`group relative flex flex-col items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                      isSelected
                        ? 'bg-purple-900/40 border-amber-400 ring-2 ring-amber-400/50 shadow-xl shadow-purple-500/20 scale-105'
                        : 'bg-slate-900/80 border-slate-700/70 hover:border-purple-500/50 hover:bg-slate-800/80'
                    }`}
                  >
                    {/* Node Order Badge */}
                    <span className="absolute -top-3 left-4 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-600 text-[10px] font-bold text-amber-400">
                      Step #{index + 1}
                    </span>

                    {/* Mini 3D Cover */}
                    <div className={`w-20 h-28 rounded-lg bg-gradient-to-br ${node.coverGradient} shadow-lg flex flex-col justify-between p-2 text-white my-2 group-hover:scale-105 transition-transform`}>
                      <div className="text-[9px] uppercase tracking-wider opacity-80">Read</div>
                      <div className="font-serif-book font-bold text-xs leading-tight line-clamp-3 text-center drop-shadow">
                        {node.title}
                      </div>
                      <div className="flex justify-end">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      </div>
                    </div>

                    {/* Node Info */}
                    <div className="text-center mt-1">
                      <h4 className="font-serif-book font-bold text-xs text-gray-100 group-hover:text-amber-300 max-w-[110px] truncate">
                        {node.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 max-w-[110px] truncate">
                        {node.author}
                      </p>
                      
                      {/* Rating */}
                      <div className="flex items-center justify-center gap-0.5 mt-1.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < node.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Flow Arrow Connector with Reason Tag */}
                  {(!isLast || currentlyReading.length > 0) && (
                    <div className="flex flex-col items-center justify-center px-2">
                      {node.reasonToNext ? (
                        <span className="text-[10px] font-semibold text-purple-300 bg-purple-950/80 border border-purple-500/40 px-2.5 py-1 rounded-full shadow-md max-w-[140px] text-center truncate mb-1" title={node.reasonToNext}>
                          {node.reasonToNext}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-gray-400 mb-1">
                          Flowed to Next
                        </span>
                      )}

                      <div className="flex items-center text-amber-400">
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

            {/* Currently Reading Tip Node */}
            {currentlyReading.map((b) => (
              <div
                key={`reading-${b.id}`}
                onClick={() => onSelectBook(b)}
                className="flex flex-col items-center p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 cursor-pointer hover:border-amber-400 transition-all"
              >
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold mb-2 flex items-center gap-1">
                  <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
                  Currently Reading
                </span>

                <div className={`w-20 h-28 rounded-lg bg-gradient-to-br ${b.coverGradient} shadow-lg flex flex-col justify-between p-2 text-white my-1`}>
                  <div className="text-[9px] uppercase tracking-wider opacity-80">Active</div>
                  <div className="font-serif-book font-bold text-xs leading-tight line-clamp-3 text-center drop-shadow">
                    {b.title}
                  </div>
                  <div className="text-[9px] text-amber-200 text-right font-sans font-bold">
                    {Math.round((b.currentPage / b.totalPages) * 100)}%
                  </div>
                </div>

                <h4 className="font-serif-book font-bold text-xs text-amber-300 max-w-[110px] truncate text-center mt-1">
                  {b.title}
                </h4>
                <p className="text-[10px] text-gray-400 max-w-[110px] truncate text-center">
                  {b.author}
                </p>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* Node Details Inspection Panel */}
      {selectedBook && (
        <div className="glass-card rounded-3xl p-6 border border-slate-700/80 bg-slate-900/90 flex flex-col md:flex-row gap-6">
          <div className={`w-32 h-44 rounded-xl bg-gradient-to-br ${selectedBook.coverGradient} flex-shrink-0 flex flex-col justify-between p-3.5 text-white shadow-xl`}>
            <span className="text-xs uppercase font-semibold opacity-80">{selectedBook.genre}</span>
            <h4 className="font-serif-book font-bold text-base line-clamp-3 drop-shadow">
              {selectedBook.title}
            </h4>
            <span className="text-xs text-amber-200">{selectedBook.author}</span>
          </div>

          <div className="flex-grow space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                  Flow Node Details
                </span>
                <h3 className="font-serif-book text-xl font-bold text-gray-100">
                  {selectedBook.title}
                </h3>
              </div>

              {selectedBook.completedDate && (
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                  Completed on {selectedBook.completedDate}
                </span>
              )}
            </div>

            {selectedBook.review?.favoriteQuote && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs italic text-amber-200 flex items-start gap-2">
                <Quote className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>"{selectedBook.review.favoriteQuote}"</span>
              </div>
            )}

            {selectedBook.review?.keyTakeaway && (
              <div>
                <span className="text-xs font-semibold text-gray-400 block mb-1">Key Takeaway</span>
                <p className="text-xs text-gray-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                  {selectedBook.review.keyTakeaway}
                </p>
              </div>
            )}

            {selectedBook.flowRecommendations && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-purple-300 block mb-2">
                  Configured Post-Read Flow Recommendations
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedBook.flowRecommendations.map(rec => (
                    <div key={rec.id} className="text-xs px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200 flex items-center gap-1.5">
                      <span className="font-bold text-amber-300">{rec.reasonTag}:</span>
                      <span>{rec.title} ({rec.author})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
