import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import type { Book, NextBookRecommendation, MoodTag } from '../types/book';
import { 
  Trophy, 
  Star, 
  GitBranch, 
  X, 
  Quote
} from 'lucide-react';

interface CompletionModalProps {
  book: Book;
  allBooks: Book[];
  onClose: () => void;
  onSaveReviewAndSelectNext: (
    bookId: string, 
    reviewData: {
      rating: number;
      favoriteQuote?: string;
      keyTakeaway?: string;
      selectedMoods: MoodTag[];
      chosenNextBookId?: string;
    },
    nextBookToStart?: Partial<Book>
  ) => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  book,
  allBooks,
  onClose,
  onSaveReviewAndSelectNext,
}) => {
  const [rating, setRating] = useState<number>(book.rating || 5);
  const [favoriteQuote, setFavoriteQuote] = useState<string>(book.review?.favoriteQuote || '');
  const [selectedNextRec, setSelectedNextRec] = useState<NextBookRecommendation | null>(null);

  useEffect(() => {
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      console.log(e);
    }
  }, []);

  const recommendations: NextBookRecommendation[] = book.flowRecommendations && book.flowRecommendations.length > 0 
    ? book.flowRecommendations
    : [
        {
          id: `rec-auto-1`,
          title: 'The Three-Body Problem',
          author: 'Cixin Liu',
          genre: 'Hard Sci-Fi',
          coverGradient: 'from-slate-800 to-stone-900',
          reasonTag: 'Sci-Fi Deep Exploration',
          description: 'A scientific contact story with cosmic stakes.',
          estimatedPages: 400,
          matchScore: 94
        },
        {
          id: `rec-auto-2`,
          title: 'Four Thousand Weeks',
          author: 'Oliver Burkeman',
          genre: 'Philosophy of Time',
          coverGradient: 'from-gray-700 to-gray-900',
          reasonTag: 'Time Philosophy',
          description: 'Embrace human limitations with clarity.',
          estimatedPages: 288,
          matchScore: 89
        }
      ];

  const handleFinishFlow = (startImmediately: boolean) => {
    let nextBookData: Partial<Book> | undefined = undefined;

    if (selectedNextRec) {
      const existing = allBooks.find(b => b.title.toLowerCase() === selectedNextRec.title.toLowerCase());
      if (existing) {
        nextBookData = {
          id: existing.id,
          status: startImmediately ? 'currently-reading' : 'up-next',
          previousBookId: book.id,
          flowConnectionReason: selectedNextRec.reasonTag,
          currentPage: startImmediately ? (existing.currentPage || 1) : 0
        };
      } else {
        nextBookData = {
          id: `book-flow-${Date.now()}`,
          title: selectedNextRec.title,
          author: selectedNextRec.author,
          genre: selectedNextRec.genre,
          totalPages: selectedNextRec.estimatedPages,
          currentPage: startImmediately ? 1 : 0,
          status: startImmediately ? 'currently-reading' : 'up-next',
          format: 'paperback',
          coverGradient: selectedNextRec.coverGradient,
          description: selectedNextRec.description,
          previousBookId: book.id,
          flowConnectionReason: selectedNextRec.reasonTag
        };
      }
    }

    onSaveReviewAndSelectNext(
      book.id,
      {
        rating,
        favoriteQuote: favoriteQuote.trim() || undefined,
        selectedMoods: [],
        chosenNextBookId: nextBookData?.id
      },
      nextBookData
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="glass-modal rounded-3xl max-w-3xl w-full p-6 lg:p-8 my-8 relative border border-gray-300 text-black max-h-[90vh] overflow-y-auto shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black text-white mb-2 shadow-md">
            <Trophy className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-black">
            Book Finished: "{book.title}"
          </h2>
          <p className="text-xs text-gray-600 mt-1">
            by {book.author} • {book.totalPages} pgs
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-3">
            Review & Reflections
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 font-semibold mb-1">
                Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-0.5 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'fill-black text-black'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 font-semibold mb-1 flex items-center gap-1">
                <Quote className="w-3 h-3 text-black" />
                Favorite Quote
              </label>
              <input
                type="text"
                value={favoriteQuote}
                onChange={(e) => setFavoriteQuote(e.target.value)}
                placeholder='e.g. "I must not fear..."'
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-black"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-300">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-3 flex items-center gap-1">
            <GitBranch className="w-4 h-4 text-black" />
            What to Read Next?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {recommendations.map((rec) => {
              const isSelected = selectedNextRec?.id === rec.id;
              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedNextRec(isSelected ? null : rec)}
                  className={`rounded-2xl p-3 cursor-pointer transition-all border flex items-center gap-3 relative ${
                    isSelected
                      ? 'bg-black text-white border-black shadow-md'
                      : 'bg-gray-50 border-gray-200 hover:border-black text-black'
                  }`}
                >
                  <div className={`w-10 h-14 rounded bg-gradient-to-br ${rec.coverGradient} flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold`}>
                    {rec.title.substring(0, 2)}
                  </div>
                  <div>
                    <span className={`text-[9px] font-bold uppercase ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                      {rec.reasonTag}
                    </span>
                    <h4 className={`font-serif-book font-bold text-xs line-clamp-1 ${isSelected ? 'text-white' : 'text-black'}`}>
                      {rec.title}
                    </h4>
                    <p className={`text-[10px] ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>by {rec.author}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => handleFinishFlow(false)}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold border border-gray-300"
            >
              Skip Next Flow
            </button>

            <button
              type="button"
              onClick={() => handleFinishFlow(true)}
              disabled={!selectedNextRec}
              className={`px-5 py-2 rounded-xl font-bold text-xs uppercase shadow transition-all ${
                selectedNextRec
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
              }`}
            >
              Start Selected Next Read
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
