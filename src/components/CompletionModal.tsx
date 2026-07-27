import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import type { Book, NextBookRecommendation, MoodTag } from '../types/book';
import { 
  Trophy, 
  Star, 
  Sparkles, 
  GitBranch, 
  ArrowRight, 
  Check, 
  X, 
  Flame, 
  Compass,
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

const MOOD_OPTIONS: MoodTag[] = [
  'Mind-Bending',
  'Cozy & Atmospheric',
  'Fast-Paced Action',
  'Deep & Philosophical',
  'Heartwarming',
  'Dark & Gritty',
  'Educational',
  'Inspiring'
];

export const CompletionModal: React.FC<CompletionModalProps> = ({
  book,
  allBooks,
  onClose,
  onSaveReviewAndSelectNext,
}) => {
  const [rating, setRating] = useState<number>(book.rating || 5);
  const [favoriteQuote, setFavoriteQuote] = useState<string>(book.review?.favoriteQuote || '');
  const [keyTakeaway, setKeyTakeaway] = useState<string>(book.review?.keyTakeaway || '');
  const [selectedMoods, setSelectedMoods] = useState<MoodTag[]>(book.review?.selectedMoods || ['Inspiring']);
  const [selectedNextRec, setSelectedNextRec] = useState<NextBookRecommendation | null>(null);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#3b82f6']
      });
    } catch (e) {
      console.log('Confetti playback fallback', e);
    }
  }, []);

  // Generate dynamic flow recommendations if none exist
  const recommendations: NextBookRecommendation[] = book.flowRecommendations && book.flowRecommendations.length > 0 
    ? book.flowRecommendations
    : [
        {
          id: `rec-auto-1`,
          title: 'The Three-Body Problem',
          author: 'Cixin Liu',
          genre: 'Hard Sci-Fi',
          coverGradient: 'from-slate-800 via-red-950 to-stone-900',
          reasonTag: 'Deep World Exploration',
          description: 'A mind-bending scientific contact story with deep cosmic stakes.',
          estimatedPages: 400,
          matchScore: 94
        },
        {
          id: `rec-auto-2`,
          title: 'Four Thousand Weeks',
          author: 'Oliver Burkeman',
          genre: 'Philosophy of Time',
          coverGradient: 'from-rose-600 via-red-700 to-orange-800',
          reasonTag: 'Palate Cleanser Non-Fiction',
          description: 'Reframing productivity and time management for human mortals.',
          estimatedPages: 288,
          matchScore: 89
        },
        {
          id: `rec-auto-3`,
          title: 'Piranesi',
          author: 'Susanna Clarke',
          genre: 'Atmospheric Fantasy',
          coverGradient: 'from-teal-700 via-emerald-800 to-slate-900',
          reasonTag: 'Short Cozy Immersion',
          description: 'An enchanting, labyrinthine mystery set in an ocean-filled hall.',
          estimatedPages: 245,
          matchScore: 91
        }
      ];

  const toggleMood = (mood: MoodTag) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(selectedMoods.filter(m => m !== mood));
    } else {
      setSelectedMoods([...selectedMoods, mood]);
    }
  };

  const handleFinishFlow = (startImmediately: boolean) => {
    let nextBookData: Partial<Book> | undefined = undefined;

    if (selectedNextRec) {
      // Check if book already exists in library
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
        keyTakeaway: keyTakeaway.trim() || undefined,
        selectedMoods,
        chosenNextBookId: nextBookData?.id
      },
      nextBookData
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="glass-modal rounded-3xl max-w-4xl w-full p-6 lg:p-8 my-8 relative border border-amber-500/30 text-gray-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full hover:bg-slate-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 text-slate-950 mb-3 shadow-lg shadow-amber-500/30">
            <Trophy className="w-9 h-9 stroke-[2.5]" />
          </div>
          <span className="block text-xs uppercase tracking-widest text-amber-400 font-bold mb-1">
            Book Completion Milestone
          </span>
          <h2 className="font-cinzel text-2xl lg:text-3xl font-bold gradient-text-gold">
            You Finished "{book.title}"!
          </h2>
          <p className="text-sm text-gray-300 mt-1">
            by {book.author} • {book.totalPages} pages complete 🎉
          </p>

          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Reading Streak Extended +1 Day!</span>
          </div>
        </div>

        {/* Step 1: Review & Key Reflections */}
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Step 1: Your Reading Reflections & Ratings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Rating & Mood Tags */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-bold text-amber-400">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-medium mb-2">
                  Reading Vibe & Emotion Tags
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {MOOD_OPTIONS.map((mood) => {
                    const isSelected = selectedMoods.includes(mood);
                    return (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => toggleMood(mood)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-bold border border-amber-400'
                            : 'bg-slate-800/80 text-gray-300 hover:bg-slate-700 border border-slate-700'
                        }`}
                      >
                        {mood}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Favorite Quote & Key Takeaway */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1 flex items-center gap-1">
                  <Quote className="w-3.5 h-3.5 text-amber-400" />
                  Favorite Quote (Optional)
                </label>
                <input
                  type="text"
                  value={favoriteQuote}
                  onChange={(e) => setFavoriteQuote(e.target.value)}
                  placeholder='e.g. "Fear is the mind-killer..."'
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1">
                  Key Takeaway or Memory Note
                </label>
                <textarea
                  rows={2}
                  value={keyTakeaway}
                  onChange={(e) => setKeyTakeaway(e.target.value)}
                  placeholder="What will stay with you from this book?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Step 2: "What to Read Next?" Post-Read Flow Engine */}
        <div className="bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/40 rounded-2xl p-5 border border-purple-500/30">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-purple-400" />
                Step 2: Choose Your Post-Read Flow Recommendation
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                Where should your reading journey flow next after finishing "{book.title}"?
              </p>
            </div>

            <span className="text-[11px] px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
              Flow Engine Match Active
            </span>
          </div>

          {/* Recommendation Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {recommendations.map((rec) => {
              const isSelected = selectedNextRec?.id === rec.id;
              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedNextRec(isSelected ? null : rec)}
                  className={`rounded-2xl p-4 cursor-pointer transition-all border flex flex-col justify-between relative group ${
                    isSelected
                      ? 'bg-purple-900/50 border-amber-400 ring-2 ring-amber-400/50 shadow-xl shadow-purple-500/20'
                      : 'bg-slate-900/90 border-slate-700/80 hover:border-purple-400/60 hover:bg-slate-800/80'
                  }`}
                >
                  {/* Selection Checkmark Badge */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}

                  <div>
                    {/* Reason Tag & Match Score */}
                    <div className="flex items-center justify-between text-[11px] font-semibold mb-3 pr-6">
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {rec.reasonTag}
                      </span>
                      <span className="text-emerald-400 font-bold">
                        {rec.matchScore}% Match
                      </span>
                    </div>

                    {/* Book Mini Cover & Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-16 rounded-lg bg-gradient-to-br ${rec.coverGradient} flex-shrink-0 shadow-md flex items-center justify-center text-white text-xs font-serif-book font-bold`}>
                        {rec.title.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-serif-book font-bold text-sm text-gray-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                          {rec.title}
                        </h4>
                        <p className="text-xs text-gray-400">by {rec.author}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{rec.genre} • ~{rec.estimatedPages} pgs</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                      {rec.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                    <span className={isSelected ? 'text-amber-300' : 'text-purple-300 group-hover:text-purple-200'}>
                      {isSelected ? 'Selected for Flow' : 'Click to Pick Flow'}
                    </span>
                    <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1 text-amber-400' : 'text-purple-400'}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer Buttons */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => handleFinishFlow(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-bold transition-all"
            >
              Skip Next Flow & Save Review
            </button>

            <div className="flex items-center gap-3 ml-auto">
              {selectedNextRec && (
                <button
                  type="button"
                  onClick={() => handleFinishFlow(false)}
                  className="px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all"
                >
                  Queue Selected in "Up-Next"
                </button>
              )}

              <button
                type="button"
                onClick={() => handleFinishFlow(true)}
                disabled={!selectedNextRec}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all ${
                  selectedNextRec
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/30 active:scale-95'
                    : 'bg-slate-800 text-gray-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <Compass className="w-4 h-4 stroke-[2.5]" />
                <span>Start Reading Next Immediately</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
