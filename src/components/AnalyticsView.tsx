import React from 'react';
import type { Book, UserReadingGoal } from '../types/book';
import { Target, Flame, BookOpen, PieChart, TrendingUp } from 'lucide-react';

interface AnalyticsViewProps {
  books: Book[];
  goal: UserReadingGoal;
  onUpdateGoal: (newGoal: number) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  books,
  goal,
  onUpdateGoal,
}) => {
  const currentlyReading = books.filter(b => b.status === 'currently-reading');
  const totalPagesRead = books.reduce((acc, b) => acc + b.currentPage, 0);

  const genreCounts: Record<string, number> = {};
  books.forEach(b => {
    genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
  });

  const totalBooksCount = books.length || 1;

  const percentGoal = Math.min(100, Math.round((goal.currentYearCount / goal.targetBooksYearly) * 100));

  return (
    <div className="space-y-6">
      
      {/* Header Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="glass-card rounded-2xl p-5 border border-gray-200 bg-white/90 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              Reading Goal
            </span>
            <Target className="w-5 h-5 text-black" />
          </div>
          <div className="text-3xl font-bold font-cinzel text-black mb-1">
            {goal.currentYearCount} / {goal.targetBooksYearly}
          </div>
          <p className="text-xs text-gray-500 mb-3">Books completed this year</p>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-black rounded-full" style={{ width: `${percentGoal}%` }} />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-gray-200 bg-white/90 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              Streak
            </span>
            <Flame className="w-5 h-5 text-black" />
          </div>
          <div className="text-3xl font-bold font-cinzel text-black mb-1">
            {goal.streakDays} Days
          </div>
          <p className="text-xs text-gray-500">Daily habit streak</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-gray-200 bg-white/90 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              Total Pages
            </span>
            <BookOpen className="w-5 h-5 text-black" />
          </div>
          <div className="text-3xl font-bold font-cinzel text-black mb-1">
            {totalPagesRead.toLocaleString()}
          </div>
          <p className="text-xs text-gray-500">Pages logged</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-gray-200 bg-white/90 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              Active Flow
            </span>
            <TrendingUp className="w-5 h-5 text-black" />
          </div>
          <div className="text-3xl font-bold font-cinzel text-black mb-1">
            {currentlyReading.length} Books
          </div>
          <p className="text-xs text-gray-500">Reading in progress</p>
        </div>

      </div>

      {/* Genre Distribution */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200 bg-white/90 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-black flex items-center gap-2">
          <PieChart className="w-4 h-4 text-black" />
          Genre Distribution
        </h3>

        <div className="space-y-3">
          {Object.entries(genreCounts).map(([genre, count]) => {
            const pct = Math.round((count / totalBooksCount) * 100);
            return (
              <div key={genre}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-800 font-semibold">{genre}</span>
                  <span className="text-black font-bold">{count} books ({pct}%)</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-2">
          <label className="text-xs font-bold text-gray-700">
            Adjust Yearly Goal:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="100"
              value={goal.targetBooksYearly}
              onChange={(e) => onUpdateGoal(parseInt(e.target.value, 10) || 12)}
              className="w-20 bg-white border border-gray-300 rounded-xl px-2 py-1 text-xs text-black text-center font-bold"
            />
            <span className="text-xs text-gray-500">books</span>
          </div>
        </div>
      </div>

    </div>
  );
};
