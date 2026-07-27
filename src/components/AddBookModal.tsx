import React, { useState } from 'react';
import type { Book, ReadingStatus, BookFormat } from '../types/book';
import { X, Plus, BookOpen } from 'lucide-react';

interface AddBookModalProps {
  onClose: () => void;
  onAddBook: (newBook: Book) => void;
}

const COVER_GRADIENTS = [
  'from-gray-700 to-gray-900',
  'from-slate-800 to-black',
  'from-amber-600 to-yellow-800',
  'from-blue-700 to-indigo-900',
  'from-emerald-700 to-teal-900',
];

export const AddBookModal: React.FC<AddBookModalProps> = ({ onClose, onAddBook }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Fiction');
  const [totalPages, setTotalPages] = useState<number>(300);
  const [status, setStatus] = useState<ReadingStatus>('want-to-read');
  const [format, setFormat] = useState<BookFormat>('paperback');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    const newBook: Book = {
      id: `book-${Date.now()}`,
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim() || 'General',
      totalPages: Number(totalPages) || 200,
      currentPage: status === 'completed' ? Number(totalPages) : 0,
      status,
      format,
      coverGradient: COVER_GRADIENTS[0],
      description: description.trim() || 'Book entry.',
    };

    onAddBook(newBook);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="glass-modal rounded-3xl max-w-lg w-full p-6 relative border border-gray-300 text-black shadow-2xl">
        
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-black" />
            <h2 className="font-cinzel text-lg font-bold text-black">Add Book</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-black"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Author *</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Genre</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-black"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Pages</label>
              <input
                type="number"
                min="1"
                value={totalPages}
                onChange={(e) => setTotalPages(parseInt(e.target.value, 10) || 100)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-black"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as BookFormat)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-black font-bold"
              >
                <option value="paperback">Paperback</option>
                <option value="hardcover">Hardcover</option>
                <option value="ebook">eBook</option>
                <option value="audiobook">Audiobook</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Shelf</label>
            <div className="grid grid-cols-3 gap-2">
              {(['currently-reading', 'up-next', 'want-to-read'] as ReadingStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    status === s
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {s.replace('-', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary..."
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-black"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1 px-5 py-2 rounded-xl bg-black text-white font-bold text-xs shadow"
            >
              <Plus className="w-4 h-4" /> Add Book
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
