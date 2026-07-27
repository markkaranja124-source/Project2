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
        
        {/* Brand */}
        <div className="flex items-center gap-3 self-start md:self-auto cursor-pointer" onClick={() => setActiveTab('library')}>
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-bold text-xl shadow-md">
            <BookOpen className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-cinzel text-xl font-bold tracking-wider text-black">
              READFLOW
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Book Tracker & Next Read Flow
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
            placeholder="Search books or author..."
            className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-4 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-xs"
          />
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-2 lg:gap-3 flex-wrap justify-end w-full md:w-auto">
          
          {/* Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 border border-gray-300 text-gray-800 text-xs font-semibold">
            <Flame className="w-4 h-4 text-black" />
            <span>{goal.streakDays} Day Streak</span>
          </div>

          {/* Goal */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 border border-gray-300 text-gray-800 text-xs font-semibold">
            <Target className="w-4 h-4 text-black" />
            <span>{goal.currentYearCount} / {goal.targetBooksYearly} Books</span>
          </div>

          {/* Reset */}
          <button
            onClick={onResetDemo}
            title="Reset demo"
            className="p-2 rounded-xl bg-white hover:bg-gray-100 text-gray-600 border border-gray-300 transition-colors shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Add Book */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Book</span>
          </button>

        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto flex items-center gap-2 mt-4 pt-3 border-t border-gray-200 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('library')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'library'
              ? 'bg-black text-white shadow-md'
              : 'text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>My Library</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'gallery'
              ? 'bg-black text-white shadow-md'
              : 'text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>Visual Gallery</span>
        </button>

        <button
          onClick={() => setActiveTab('chapter-memory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'chapter-memory'
              ? 'bg-black text-white shadow-md'
              : 'text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Chapter Memory Quiz</span>
        </button>

        <button
          onClick={() => setActiveTab('flow-chain')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'flow-chain'
              ? 'bg-black text-white shadow-md'
              : 'text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          <GitFork className="w-4 h-4" />
          <span>Next Read Flow</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-black text-white shadow-md'
              : 'text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Reading Goals</span>
        </button>
      </div>

    </header>
  );
};
