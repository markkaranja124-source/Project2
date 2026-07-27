import type { Book, UserReadingGoal, ReadChainNode } from '../types/book';
import { INITIAL_BOOKS, INITIAL_GOAL } from '../data/initialBooks';

const BOOKS_STORAGE_KEY = 'readflow_books_v1';
const GOAL_STORAGE_KEY = 'readflow_goal_v1';

export const loadBooksFromStorage = (): Book[] => {
  try {
    const saved = localStorage.getItem(BOOKS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load books from storage', e);
  }
  return INITIAL_BOOKS;
};

export const saveBooksToStorage = (books: Book[]): void => {
  try {
    localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books));
  } catch (e) {
    console.error('Failed to save books to storage', e);
  }
};

export const loadGoalFromStorage = (): UserReadingGoal => {
  try {
    const saved = localStorage.getItem(GOAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load goal from storage', e);
  }
  return INITIAL_GOAL;
};

export const saveGoalToStorage = (goal: UserReadingGoal): void => {
  try {
    localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(goal));
  } catch (e) {
    console.error('Failed to save goal to storage', e);
  }
};

export const resetStorageToDefaults = (): { books: Book[]; goal: UserReadingGoal } => {
  localStorage.removeItem(BOOKS_STORAGE_KEY);
  localStorage.removeItem(GOAL_STORAGE_KEY);
  return { books: INITIAL_BOOKS, goal: INITIAL_GOAL };
};

// Generate connected flow chain from completed books
export const buildReadChain = (books: Book[]): ReadChainNode[] => {
  const completedBooks = books
    .filter(b => b.status === 'completed' && b.completedDate)
    .sort((a, b) => new Date(a.completedDate!).getTime() - new Date(b.completedDate!).getTime());

  return completedBooks.map((book) => {
    const nextBookInFlow = books.find(b => b.previousBookId === book.id || book.review?.chosenNextBookId === b.id);
    return {
      id: `chain-${book.id}`,
      bookId: book.id,
      title: book.title,
      author: book.author,
      completedDate: book.completedDate || '',
      rating: book.rating || 5,
      coverGradient: book.coverGradient,
      nextBookId: nextBookInFlow?.id,
      reasonToNext: nextBookInFlow?.flowConnectionReason || book.review?.chosenNextBookId ? 'Selected in Post-Read Flow' : undefined
    };
  });
};
