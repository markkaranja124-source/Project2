export type ReadingStatus = 'currently-reading' | 'up-next' | 'want-to-read' | 'completed';

export type BookFormat = 'hardcover' | 'paperback' | 'ebook' | 'audiobook';

export type MoodTag = 
  | 'Mind-Bending' 
  | 'Cozy & Atmospheric' 
  | 'Fast-Paced Action' 
  | 'Deep & Philosophical' 
  | 'Heartwarming' 
  | 'Dark & Gritty' 
  | 'Educational' 
  | 'Inspiring';

export interface NextBookRecommendation {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverGradient: string;
  coverImage?: string;
  reasonTag: string;
  description: string;
  estimatedPages: number;
  matchScore: number;
  existingBookId?: string;
}

export interface BookReview {
  rating: number;
  completedDate: string;
  favoriteQuote?: string;
  keyTakeaway?: string;
  selectedMoods: MoodTag[];
  chosenNextBookId?: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  keyConcept: string;
}

export interface ChapterQuiz {
  chapterNumber: number;
  chapterTitle: string;
  summaryText: string;
  questions: QuizQuestion[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  totalPages: number;
  currentPage: number;
  status: ReadingStatus;
  format: BookFormat;
  coverGradient: string;
  coverImage?: string;
  coverEmoji?: string;
  rating?: number;
  startDate?: string;
  completedDate?: string;
  description: string;
  notes?: string;
  review?: BookReview;
  chapterQuizzes?: ChapterQuiz[];
  flowRecommendations?: NextBookRecommendation[];
  previousBookId?: string;
  flowConnectionReason?: string;
}

export interface ReadChainNode {
  id: string;
  bookId: string;
  title: string;
  author: string;
  completedDate: string;
  rating: number;
  coverGradient: string;
  coverImage?: string;
  nextBookId?: string;
  reasonToNext?: string;
}

export interface UserReadingGoal {
  targetBooksYearly: number;
  currentYearCount: number;
  streakDays: number;
  lastReadDate: string;
  memoryQuizScoreTotal: number;
  quizzesCompletedCount: number;
}
