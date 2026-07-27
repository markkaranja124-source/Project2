import React, { useState } from 'react';
import type { Book, ChapterQuiz, QuizQuestion } from '../types/book';
import { 
  Brain, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Plus, 
  Sparkles, 
  BookOpen, 
  RotateCcw,
  Check,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChapterMemoryLabProps {
  books: Book[];
  initialBookId?: string | null;
  onCompleteQuiz: (score: number) => void;
  onAddCustomQuestion: (bookId: string, chapterNumber: number, question: QuizQuestion) => void;
}

export const ChapterMemoryLab: React.FC<ChapterMemoryLabProps> = ({
  books,
  initialBookId,
  onCompleteQuiz,
  onAddCustomQuestion,
}) => {
  const booksWithQuizzes = books.filter(b => b.chapterQuizzes && b.chapterQuizzes.length > 0);
  const defaultBook = (initialBookId && books.find(b => b.id === initialBookId)) 
    || (booksWithQuizzes.length > 0 ? booksWithQuizzes[0] : books[0]);

  const [selectedBookId, setSelectedBookId] = useState<string>(defaultBook?.id || '');
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);

  // Active quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Custom question form modal state
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOpt0, setNewOpt0] = useState('');
  const [newOpt1, setNewOpt1] = useState('');
  const [newOpt2, setNewOpt2] = useState('');
  const [newOpt3, setNewOpt3] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');
  const [newConcept, setNewConcept] = useState('Chapter Memory');

  const selectedBook = books.find(b => b.id === selectedBookId) || defaultBook;
  const currentChapterQuiz: ChapterQuiz | undefined = selectedBook?.chapterQuizzes?.[selectedChapterIndex];

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (!currentChapterQuiz) return;
    let correctCount = 0;
    currentChapterQuiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        correctCount += 1;
      }
    });

    const percent = Math.round((correctCount / currentChapterQuiz.questions.length) * 100);
    setQuizScore(percent);
    setIsSubmitted(true);
    onCompleteQuiz(percent);

    if (percent === 100) {
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setQuizScore(null);
  };

  const handleAddQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !newOpt0.trim() || !newOpt1.trim()) return;

    const newQ: QuizQuestion = {
      id: `q-custom-${Date.now()}`,
      questionText: newQuestionText.trim(),
      options: [newOpt0.trim(), newOpt1.trim(), newOpt2.trim() || 'Option C', newOpt3.trim() || 'Option D'],
      correctOptionIndex: correctIdx,
      explanation: newExplanation.trim() || 'Custom chapter retention insight.',
      keyConcept: newConcept.trim() || 'Key Concept'
    };

    onAddCustomQuestion(selectedBook.id, currentChapterQuiz?.chapterNumber || 1, newQ);
    setIsAddingQuestion(false);
    setNewQuestionText('');
    setNewOpt0('');
    setNewOpt1('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
              <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>Active Recall Memory Engine</span>
            </div>
            <h2 className="font-cinzel text-2xl lg:text-3xl font-bold gradient-text-purple">
              Chapter Memory Boost Lab
            </h2>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl">
              Enhance memory retention while reading. Answer chapter-by-chapter questions to test comprehension and lock key concepts into long-term memory.
            </p>
          </div>

          <button
            onClick={() => setIsAddingQuestion(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-purple-400" />
            <span>Add Custom Chapter Question</span>
          </button>
        </div>
      </div>

      {/* Book & Chapter Selection Strip */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        
        {/* Book Selector */}
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <div>
            <label className="block text-[10px] uppercase font-semibold text-gray-400">Target Book</label>
            <select
              value={selectedBookId}
              onChange={(e) => {
                setSelectedBookId(e.target.value);
                setSelectedChapterIndex(0);
                handleResetQuiz();
              }}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
            >
              {books.map(b => (
                <option key={b.id} value={b.id}>
                  {b.title} by {b.author} ({b.chapterQuizzes?.length || 0} chapters)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chapter Selector */}
        {selectedBook?.chapterQuizzes && selectedBook.chapterQuizzes.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {selectedBook.chapterQuizzes.map((chap, idx) => (
              <button
                key={chap.chapterNumber}
                onClick={() => {
                  setSelectedChapterIndex(idx);
                  handleResetQuiz();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedChapterIndex === idx
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                    : 'bg-slate-900 text-gray-400 hover:text-gray-200 border border-slate-800'
                }`}
              >
                Ch. {chap.chapterNumber}: {chap.chapterTitle}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Main Quiz Area */}
      {!currentChapterQuiz ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-800">
          <Brain className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <h3 className="font-serif-book font-bold text-lg text-gray-300">No quizzes configured for "{selectedBook?.title}" yet</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
            Click "Add Custom Chapter Question" above to create active recall memory questions for this book!
          </p>
          <button
            onClick={() => setIsAddingQuestion(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create First Question
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Chapter Summary Header */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 bg-slate-900/80">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <span className="text-xs uppercase tracking-widest font-bold text-amber-400">
                Chapter {currentChapterQuiz.chapterNumber} Active Recall
              </span>
              <span className="text-xs text-purple-300 font-semibold bg-purple-950/60 border border-purple-500/30 px-2.5 py-1 rounded-full">
                {currentChapterQuiz.questions.length} Comprehension Questions
              </span>
            </div>
            <h3 className="font-serif-book text-xl font-bold text-gray-100 mb-2">
              {currentChapterQuiz.chapterTitle}
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <strong className="text-amber-300 font-semibold">Summary Context:</strong> {currentChapterQuiz.summaryText}
            </p>
          </div>

          {/* Quiz Score Result Banner */}
          {isSubmitted && quizScore !== null && (
            <div className={`rounded-3xl p-6 border flex items-center justify-between flex-wrap gap-4 ${
              quizScore >= 80 
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200' 
                : 'bg-amber-950/60 border-amber-500/40 text-amber-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center font-bold text-2xl">
                  <Award className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-base">
                    Memory Retention Score: {quizScore}%
                  </h4>
                  <p className="text-xs opacity-90">
                    {quizScore === 100 
                      ? '🎯 Perfect Recall! Key concepts successfully reinforced into long-term memory.' 
                      : 'Good effort! Review the explanations below to solidify memory.'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleResetQuiz}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-gray-200 border border-slate-700 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Chapter Quiz</span>
              </button>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-5">
            {currentChapterQuiz.questions.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[q.id];

              return (
                <div key={q.id} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
                  
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                        Question #{qIdx + 1} • {q.keyConcept}
                      </span>
                      <h4 className="font-serif-book font-bold text-base text-gray-100 mt-2">
                        {q.questionText}
                      </h4>
                    </div>

                    {isSubmitted && (
                      <div>
                        {selectedOpt === q.correctOptionIndex ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Incorrect
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((optText, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      const isCorrectOption = optIdx === q.correctOptionIndex;

                      let btnStyle = 'bg-slate-900/90 border-slate-800 hover:border-purple-500/50 text-gray-300';
                      if (isOptionSelected) {
                        btnStyle = 'bg-purple-900/50 border-amber-400 ring-1 ring-amber-400 text-white font-semibold';
                      }
                      if (isSubmitted) {
                        if (isCorrectOption) {
                          btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                        } else if (isOptionSelected && !isCorrectOption) {
                          btnStyle = 'bg-red-950/80 border-red-500 text-red-200 opacity-80';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isSubmitted}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`p-3.5 rounded-2xl border text-left text-xs transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                        >
                          <span>{optText}</span>
                          {isOptionSelected && <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanatory Concept Hint after submission */}
                  {isSubmitted && (
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-gray-300 space-y-1">
                      <span className="font-bold text-amber-400 block">💡 Memory Insight ({q.keyConcept}):</span>
                      <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* Submit Quiz Action */}
          {!isSubmitted && (
            <div className="flex justify-end pt-3">
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < currentChapterQuiz.questions.length}
                className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all ${
                  Object.keys(selectedAnswers).length >= currentChapterQuiz.questions.length
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-emerald-500/30 hover:scale-105 active:scale-95'
                    : 'bg-slate-800 text-gray-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <span>Submit Answers & Calculate Memory Score</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* Add Custom Question Modal */}
      {isAddingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-modal rounded-3xl max-w-lg w-full p-6 relative border border-purple-500/30 text-gray-100">
            <h3 className="font-cinzel font-bold text-lg text-purple-300 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Add Custom Chapter Memory Question
            </h3>

            <form onSubmit={handleAddQuestionSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Question Prompt</label>
                <input
                  type="text"
                  required
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="e.g. What was Paul's reaction to..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={newOpt0}
                  onChange={(e) => setNewOpt0(e.target.value)}
                  placeholder="Option 1"
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-gray-100"
                />
                <input
                  type="text"
                  required
                  value={newOpt1}
                  onChange={(e) => setNewOpt1(e.target.value)}
                  placeholder="Option 2"
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-gray-100"
                />
                <input
                  type="text"
                  value={newOpt2}
                  onChange={(e) => setNewOpt2(e.target.value)}
                  placeholder="Option 3"
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-gray-100"
                />
                <input
                  type="text"
                  value={newOpt3}
                  onChange={(e) => setNewOpt3(e.target.value)}
                  placeholder="Option 4"
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-gray-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Which option is correct?</label>
                <select
                  value={correctIdx}
                  onChange={(e) => setCorrectIdx(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-bold"
                >
                  <option value={0}>Option 1</option>
                  <option value={1}>Option 2</option>
                  <option value={2}>Option 3</option>
                  <option value={3}>Option 4</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Key Concept / Memory Insight</label>
                <input
                  type="text"
                  value={newConcept}
                  onChange={(e) => setNewConcept(e.target.value)}
                  placeholder="e.g. Identity-based habits"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-gray-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Explanation</label>
                <textarea
                  rows={2}
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  placeholder="Why is this answer correct?"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-gray-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingQuestion(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-gray-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
