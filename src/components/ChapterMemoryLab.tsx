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

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

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
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
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
      explanation: newExplanation.trim() || 'Chapter concept hint.',
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
      <div className="glass-card rounded-3xl p-6 border border-gray-200 bg-white/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-gray-100 border border-gray-300 text-black text-xs font-semibold mb-2">
            Active Recall Quiz
          </span>
          <h2 className="font-cinzel text-2xl lg:text-3xl font-bold text-black">
            Chapter Memory Quiz
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Test comprehension chapter by chapter to lock key concepts into memory.
          </p>
        </div>

        <button
          onClick={() => setIsAddingQuestion(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold transition-all"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add Custom Question</span>
        </button>
      </div>

      {/* Book & Chapter Selector */}
      <div className="glass-card rounded-2xl p-4 border border-gray-200 bg-white flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-black" />
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-500">Book</label>
            <select
              value={selectedBookId}
              onChange={(e) => {
                setSelectedBookId(e.target.value);
                setSelectedChapterIndex(0);
                handleResetQuiz();
              }}
              className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-black font-bold focus:outline-none focus:border-black"
            >
              {books.map(b => (
                <option key={b.id} value={b.id}>
                  {b.title} by {b.author}
                </option>
              ))}
            </select>
          </div>
        </div>

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
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Ch. {chap.chapterNumber}: {chap.chapterTitle}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Main Quiz */}
      {!currentChapterQuiz ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-gray-200 bg-white">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-serif-book font-bold text-lg text-black">No quizzes for "{selectedBook?.title}" yet</h3>
          <p className="text-xs text-gray-500 mt-1">
            Click "Add Custom Question" to create questions for this book.
          </p>
          <button
            onClick={() => setIsAddingQuestion(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Question
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          <div className="glass-card rounded-3xl p-6 border border-gray-200 bg-white">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <span className="text-xs uppercase font-bold text-gray-500">
                Chapter {currentChapterQuiz.chapterNumber}
              </span>
              <span className="text-xs text-gray-800 font-semibold bg-gray-100 px-2.5 py-1 rounded-full border border-gray-300">
                {currentChapterQuiz.questions.length} Questions
              </span>
            </div>
            <h3 className="font-serif-book text-xl font-bold text-black mb-2">
              {currentChapterQuiz.chapterTitle}
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-200">
              <strong className="text-black">Context:</strong> {currentChapterQuiz.summaryText}
            </p>
          </div>

          {isSubmitted && quizScore !== null && (
            <div className="rounded-3xl p-6 border bg-white border-gray-300 text-black flex items-center justify-between flex-wrap gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-xl">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base">
                    Score: {quizScore}%
                  </h4>
                  <p className="text-xs text-gray-600">
                    {quizScore === 100 ? 'Perfect Recall!' : 'Review explanations below to reinforce key points.'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleResetQuiz}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-black border border-gray-300 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
            </div>
          )}

          <div className="space-y-5">
            {currentChapterQuiz.questions.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[q.id];

              return (
                <div key={q.id} className="glass-card rounded-3xl p-6 border border-gray-200 bg-white space-y-4 shadow-xs">
                  
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                        Q#{qIdx + 1} • {q.keyConcept}
                      </span>
                      <h4 className="font-serif-book font-bold text-base text-black mt-2">
                        {q.questionText}
                      </h4>
                    </div>

                    {isSubmitted && (
                      <div>
                        {selectedOpt === q.correctOptionIndex ? (
                          <span className="px-2.5 py-1 rounded-full bg-black text-white text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-gray-200 text-gray-900 border border-gray-300 text-xs font-bold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5 text-black" /> Incorrect
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((optText, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      const isCorrectOption = optIdx === q.correctOptionIndex;

                      let btnStyle = 'bg-white border-gray-300 hover:border-black text-gray-800';
                      if (isOptionSelected) {
                        btnStyle = 'bg-gray-100 border-black ring-1 ring-black text-black font-bold';
                      }
                      if (isSubmitted) {
                        if (isCorrectOption) {
                          btnStyle = 'bg-black border-black text-white font-bold';
                        } else if (isOptionSelected && !isCorrectOption) {
                          btnStyle = 'bg-gray-200 border-gray-400 text-gray-900 line-through';
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
                          {isOptionSelected && <Check className="w-4 h-4 text-black flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && (
                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-700 space-y-1">
                      <span className="font-bold text-black block">Insight ({q.keyConcept}):</span>
                      <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {!isSubmitted && (
            <div className="flex justify-end pt-3">
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < currentChapterQuiz.questions.length}
                className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md transition-all ${
                  Object.keys(selectedAnswers).length >= currentChapterQuiz.questions.length
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                }`}
              >
                <span>Submit Answers</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* Add Custom Question Modal */}
      {isAddingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="glass-modal rounded-3xl max-w-lg w-full p-6 relative border border-gray-300 text-black shadow-2xl">
            <h3 className="font-cinzel font-bold text-lg text-black mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-black" />
              Add Custom Question
            </h3>

            <form onSubmit={handleAddQuestionSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Question Prompt</label>
                <input
                  type="text"
                  required
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="e.g. What was Paul's reaction..."
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={newOpt0}
                  onChange={(e) => setNewOpt0(e.target.value)}
                  placeholder="Option 1"
                  className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-black"
                />
                <input
                  type="text"
                  required
                  value={newOpt1}
                  onChange={(e) => setNewOpt1(e.target.value)}
                  placeholder="Option 2"
                  className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-black"
                />
                <input
                  type="text"
                  value={newOpt2}
                  onChange={(e) => setNewOpt2(e.target.value)}
                  placeholder="Option 3"
                  className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-black"
                />
                <input
                  type="text"
                  value={newOpt3}
                  onChange={(e) => setNewOpt3(e.target.value)}
                  placeholder="Option 4"
                  className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Correct Option</label>
                <select
                  value={correctIdx}
                  onChange={(e) => setCorrectIdx(parseInt(e.target.value, 10))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-black font-bold"
                >
                  <option value={0}>Option 1</option>
                  <option value={1}>Option 2</option>
                  <option value={2}>Option 3</option>
                  <option value={3}>Option 4</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Key Concept</label>
                <input
                  type="text"
                  value={newConcept}
                  onChange={(e) => setNewConcept(e.target.value)}
                  placeholder="e.g. Memory Retention"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Explanation</label>
                <textarea
                  rows={2}
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  placeholder="Why is this correct?"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-black"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingQuestion(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold"
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
