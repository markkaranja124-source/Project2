import React from 'react';
import type { Book, UserReadingGoal } from '../types/book';
import { Target, Flame, BookOpen, Star, PieChart, TrendingUp, Layers, Award } from 'lucide-react';

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
  const completedBooks = books.filter(b => b.status === 'completed');
  const currentlyReading = books.filter(b => b.status === 'currently-reading');
  const totalPagesRead = books.reduce((acc, b) => acc + b.currentPage, 0);

  // Genre distribution calculation
  const genreCounts: Record<string, number> = {};
  books.forEach(b => {
    genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
  });

  const totalBooksCount = books.length || 1;

  // Format breakdown calculation
  const formatCounts: Record<string, number> = {};
  books.forEach(b => {
    formatCounts[b.format] = (formatCounts[b.format] || 0) + 1;
  });

  const percentGoal = Math.min(100, Math.round((goal.currentYearCount / goal.targetBooksYearly) * 100));

  return (
    <div className="space-y-6">
      
      {/* Header Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Goal Card */}
        <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-teal-950/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              2026 Reading Goal
            </span>
            <Target className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-cinzel text-gray-100 mb-1">
            {goal.currentYearCount} / {goal.targetBooksYearly}
          </div>
          <p className="text-xs text-gray-400 mb-3">Books completed this year</p>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${percentGoal}%` }} />
          </div>
        </div>

        {/* Streak Card */}
        <div className="glass-card rounded-2xl p-5 border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-slate-900 to-orange-950/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Reading Streak
            </span>
            <Flame className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-bold font-cinzel text-amber-400 mb-1">
            {goal.streakDays} Days
          </div>
          <p className="text-xs text-gray-400">Consistent daily habits</p>
        </div>

        {/* Total Pages Card */}
        <div className="glass-card rounded-2xl p-5 border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
              Total Pages Logged
            </span>
            <BookOpen className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold font-cinzel text-purple-300 mb-1">
            {totalPagesRead.toLocaleString()}
          </div>
          <p className="text-xs text-gray-400">Across all shelf books</p>
        </div>

        {/* Currently Reading Card */}
        <div className="glass-card rounded-2xl p-5 border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-blue-950/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              In Active Flow
            </span>
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold font-cinzel text-cyan-300 mb-1">
            {currentlyReading.length} Books
          </div>
          <p className="text-xs text-gray-400">Currently in progress</p>
        </div>

      </div>

      {/* Genre Distribution & Format Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Genre Breakdown */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-400" />
            Genre Diversity Breakdown
          </h3>

          <div className="space-y-3">
            {Object.entries(genreCounts).map(([genre, count]) => {
              const pct = Math.round((count / totalBooksCount) * 100);
              return (
                <div key={genre}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-300 font-medium">{genre}</span>
                    <span className="text-amber-400 font-bold">{count} books ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reading Format Preference */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            Format Preferences
          </h3>

          <div className="space-y-3">
            {Object.entries(formatCounts).map(([format, count]) => {
              const pct = Math.round((count / totalBooksCount) * 100);
              return (
                <div key={format}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-300 font-medium capitalize">{format}</span>
                    <span className="text-purple-300 font-bold">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <label className="block text-xs font-semibold text-gray-400 mb-2">
              Adjust Yearly Reading Target
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="100"
                value={goal.targetBooksYearly}
                onChange={(e) => onUpdateGoal(parseInt(e.target.value, 10) || 12)}
                className="w-24 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-gray-100 text-center font-bold focus:outline-none focus:border-amber-500"
              />
              <span className="text-xs text-gray-400">Books target for 2026</span>
            </div>
          </div>

        </div>

      </div>

      {/* Top Rated Hall of Fame */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-400" />
          Completed Favorites Hall of Fame
        </h3>

        {completedBooks.length === 0 ? (
          <p className="text-xs text-gray-400">No completed books logged yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {completedBooks.map(b => (
              <div key={b.id} className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex items-center gap-3">
                <div className={`w-12 h-16 rounded-lg bg-gradient-to-br ${b.coverGradient} flex-shrink-0 shadow flex items-center justify-center text-white text-xs font-serif-book font-bold`}>
                  {b.title.substring(0, 2)}
                </div>
                <div>
                  <h4 className="font-serif-book font-bold text-xs text-gray-100 line-clamp-1">{b.title}</h4>
                  <p className="text-[10px] text-gray-400">by {b.author}</p>
                  <div className="flex items-center gap-1 text-amber-400 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < (b.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
