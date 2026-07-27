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
  reasonTag: string; // e.g. "Deeper Sci-Fi Worldbuilding", "Palate Cleanser", "Same Author"
  description: string;
  estimatedPages: number;
  matchScore: number; // e.g. 96 (%)
  existingBookId?: string; // If it points to a book already in library
}

export interface BookReview {
  rating: number; // 1-5
  completedDate: string;
  favoriteQuote?: string;
  keyTakeaway?: string;
  selectedMoods: MoodTag[];
  chosenNextBookId?: string;
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
  coverEmoji?: string;
  rating?: number;
  startDate?: string;
  completedDate?: string;
  description: string;
  notes?: string;
  review?: BookReview;
  flowRecommendations?: NextBookRecommendation[];
  previousBookId?: string; // The book finished right before this one in the flow
  flowConnectionReason?: string; // Reason why this book was picked after previousBookId
}

export interface ReadChainNode {
  id: string;
  bookId: string;
  title: string;
  author: string;
  completedDate: string;
  rating: number;
  coverGradient: string;
  nextBookId?: string;
  reasonToNext?: string;
}

export interface UserReadingGoal {
  targetBooksYearly: number;
  currentYearCount: number;
  streakDays: number;
  lastReadDate: string;
}
