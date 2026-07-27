import React from 'react';
import { BookOpen, Brain, GitFork, Sparkles, Award } from 'lucide-react';
import type { UserReadingGoal } from '../types/book';

interface HeroBannerProps {
  goal: UserReadingGoal;
  onNavigateTab: (tab: 'library' | 'gallery' | 'chapter-memory' | 'flow-chain' | 'analytics') => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ goal, onNavigateTab }) => {
  return (
    <div className="relative rounded-3xl overflow-hidden glass-card border border-amber-500/20 mb-8 bg-slate-900/90 shadow-2xl">
      
      {/* Background Library Photography with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity hover:opacity-50 transition-opacity">
        <img
          src="/images/library_hero.png"
          alt="Atmospheric Luxury Library"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      {/* Hero Content Grid */}
      <div className="relative z-10 p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Headline & Action CTAs */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Reader & Active Memory Hub</span>
          </div>

          <h1 className="font-cinzel text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Read Deeply. <br />
            <span className="gradient-text-gold">Remember Every Chapter.</span>
          </h1>

          <p className="text-sm lg:text-base text-gray-300 max-w-xl leading-relaxed">
            Track your reading progress, test your comprehension with <strong className="text-amber-300 font-semibold">Chapter Active Recall Quizzes</strong>, and discover what to read next with your personal <strong className="text-purple-300 font-semibold">Post-Read Flow Engine</strong>.
          </p>

          {/* Quick Action Navigation Buttons */}
          <div className="flex items-center gap-3 flex-wrap pt-2">
            <button
              onClick={() => onNavigateTab('chapter-memory')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/25 transition-all active:scale-95"
            >
              <Brain className="w-4 h-4 text-purple-200" />
              <span>Chapter Memory Lab</span>
            </button>

            <button
              onClick={() => onNavigateTab('gallery')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all active:scale-95"
            >
              <BookOpen className="w-4 h-4 stroke-[2.5]" />
              <span>Visual Book Gallery</span>
            </button>

            <button
              onClick={() => onNavigateTab('flow-chain')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-gray-200 font-semibold text-xs transition-all"
            >
              <GitFork className="w-4 h-4 text-purple-400" />
              <span>Post-Read Flow</span>
            </button>
          </div>

        </div>

        {/* Right Student Photography Feature Card */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-2xl group">
            <img
              src="/images/student_study.png"
              alt="Student Reading and Studying in Library"
              className="w-full h-56 lg:h-64 object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

            {/* Floating Live Memory Score Badge */}
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-gray-100 block text-xs">Active Recall Memory</span>
                  <span className="text-[10px] text-gray-400">Chapter retention test active</span>
                </div>
              </div>
              <div className="text-right font-bold text-emerald-400">
                {goal.quizzesCompletedCount > 0 
                  ? `${Math.round(goal.memoryQuizScoreTotal / goal.quizzesCompletedCount)}% Score` 
                  : 'Ready to Test'}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
