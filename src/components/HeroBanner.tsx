import React from 'react';
import { BookOpen, Brain, GitFork } from 'lucide-react';
import type { UserReadingGoal } from '../types/book';

interface HeroBannerProps {
  goal: UserReadingGoal;
  onNavigateTab: (tab: 'library' | 'gallery' | 'chapter-memory' | 'flow-chain' | 'analytics') => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ goal, onNavigateTab }) => {
  return (
    <div className="relative rounded-3xl overflow-hidden glass-card border border-gray-200 mb-8 bg-white/90 shadow-xl">
      
      {/* Background Library Image */}
      <div className="absolute inset-0 z-0 opacity-25 mix-blend-multiply">
        <img
          src="/images/library_hero.png"
          alt="Library"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
      </div>

      <div className="relative z-10 p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Headline & Simple CTAs */}
        <div className="lg:col-span-8 space-y-3">
          
          <span className="inline-block px-3 py-1 rounded-full bg-gray-100 border border-gray-300 text-black text-xs font-semibold">
            Personal Reading Companion
          </span>

          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-black tracking-tight leading-snug">
            Track Reading. Test Memory. Discover Next.
          </h1>

          <p className="text-sm text-gray-600 max-w-lg leading-relaxed">
            Keep track of your current books, test your chapter memory, and seamlessly flow into your next read.
          </p>

          <div className="flex items-center gap-3 flex-wrap pt-2">
            <button
              onClick={() => onNavigateTab('chapter-memory')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
            >
              <Brain className="w-4 h-4 text-white" />
              <span>Chapter Quiz</span>
            </button>

            <button
              onClick={() => onNavigateTab('gallery')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-gray-100 border border-gray-300 text-black font-bold text-xs uppercase tracking-wider shadow-xs transition-all active:scale-95"
            >
              <BookOpen className="w-4 h-4 stroke-[2.5]" />
              <span>Visual Gallery</span>
            </button>

            <button
              onClick={() => onNavigateTab('flow-chain')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 font-semibold text-xs transition-all"
            >
              <GitFork className="w-4 h-4 text-black" />
              <span>Next Read Flow</span>
            </button>
          </div>

        </div>

        {/* Student Image Card */}
        <div className="lg:col-span-4 relative hidden sm:block">
          <div className="relative rounded-2xl overflow-hidden border border-gray-300 shadow-md group">
            <img
              src="/images/student_study.png"
              alt="Studying"
              className="w-full h-44 object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-xs font-bold text-black flex items-center justify-between">
              <span>Chapter Retention</span>
              <span className="px-2 py-0.5 rounded bg-black text-white text-[10px]">
                {goal.quizzesCompletedCount > 0 
                  ? `${Math.round(goal.memoryQuizScoreTotal / goal.quizzesCompletedCount)}% Score` 
                  : 'Ready'}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
