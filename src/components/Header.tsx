import React from 'react';
import { BookOpen, GitFork, BarChart3, Plus, Flame, Target, Search, RotateCcw, Brain, Image } from 'lucide-react';
import type { UserReadingGoal } from '../types/book';

interface HeaderProps {
  activeTab: 'library' | 'gallery' | 'chapter-memory' | 'flow-chain' | 'analytics';
  setActiveTab: (tab: 'library' | 'gallery' | 'chapter-memory' | 'flow-chain' | 'analytics') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  goal: UserReadingGoal;
  onOpenAddModal: () => void;
  onResetDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  goal,
  onOpenAddModal,
  onResetDemo,
}) => {
  return (
    <header className="sticky top-0 z-40 glass-nav px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3 self-start md:self-auto cursor-pointer" onClick={() => setActiveTab('library')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white font-bold text-xl">
            <BookOpen className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-cinzel text-xl font-bold tracking-wider gradient-text-gold">
                READFLOW
              </h1>
              <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                v2 Active Recall
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium">
              Book tracker, chapter memory lab & post-read flow
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64 lg:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, author, or genre..."
            className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl pl-9 pr-4 py-1.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all"
          />
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-2 lg:gap-3 flex-wrap justify-end w-full md:w-auto">
          
          {/* Memory Score Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold" title="Chapter Memory Recall Accuracy">
            <Brain className="w-4 h-4 text-purple-400" />
            <span>
              {goal.quizzesCompletedCount > 0 
                ? `${Math.round(goal.memoryQuizScoreTotal / goal.quizzesCompletedCount)}% Recall` 
                : 'Memory Quiz Ready'}
            </span>
          </div>

          {/* Streak Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold" title="Daily Reading Streak">
            <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
            <span>{goal.streakDays} Day Streak</span>
          </div>

          {/* Goal Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold" title="2026 Reading Goal Progress">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>{goal.currentYearCount} / {goal.targetBooksYearly} Books</span>
          </div>

          {/* Reset Demo Button */}
          <button
            onClick={onResetDemo}
            title="Reset to sample books demo state"
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-gray-400 hover:text-gray-200 border border-slate-700/40 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Add Book Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Book</span>
          </button>

        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('library')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'library'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-500/5'
              : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>My Library & Shelves</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'gallery'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-500/5'
              : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <Image className="w-4 h-4 text-amber-400" />
          <span>Visual Book Gallery</span>
        </button>

        <button
          onClick={() => setActiveTab('chapter-memory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap relative ${
            activeTab === 'chapter-memory'
              ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-md shadow-purple-500/5'
              : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <Brain className="w-4 h-4 text-purple-400" />
          <span>Chapter Memory Lab</span>
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
        </button>

        <button
          onClick={() => setActiveTab('flow-chain')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'flow-chain'
              ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-md shadow-purple-500/5'
              : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <GitFork className="w-4 h-4 text-purple-400" />
          <span>Post-Read Flow Chain</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-md shadow-emerald-500/5'
              : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Reading Insights & Goals</span>
        </button>
      </div>

    </header>
  );
};
