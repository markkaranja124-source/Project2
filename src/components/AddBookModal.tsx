import React, { useState } from 'react';
import type { Book, ReadingStatus, BookFormat } from '../types/book';
import { X, Plus, BookOpen, GitBranch } from 'lucide-react';

interface AddBookModalProps {
  onClose: () => void;
  onAddBook: (newBook: Book) => void;
}

const COVER_GRADIENTS = [
  'from-amber-600 via-orange-600 to-yellow-700',
  'from-indigo-600 via-purple-700 to-pink-600',
  'from-emerald-600 via-teal-700 to-cyan-700',
  'from-cyan-600 via-blue-700 to-indigo-900',
  'from-rose-600 via-red-700 to-orange-800',
  'from-violet-600 via-fuchsia-700 to-pink-700',
  'from-slate-800 via-red-950 to-stone-900',
  'from-amber-500 via-yellow-600 to-lime-600',
];

const EMOJI_OPTIONS = ['📖', '⏳', '🎯', '⚡', '☀️', '🚀', '🌌', '🏛️', '🎮', '💡', '🔥', '🔮'];

export const AddBookModal: React.FC<AddBookModalProps> = ({ onClose, onAddBook }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Sci-Fi');
  const [totalPages, setTotalPages] = useState<number>(320);
  const [status, setStatus] = useState<ReadingStatus>('want-to-read');
  const [format, setFormat] = useState<BookFormat>('paperback');
  const [coverGradient, setCoverGradient] = useState(COVER_GRADIENTS[0]);
  const [coverEmoji, setCoverEmoji] = useState('📖');
  const [description, setDescription] = useState('');

  // Flow recommendation fields
  const [recTitle, setRecTitle] = useState('');
  const [recAuthor, setRecAuthor] = useState('');
  const [recReason, setRecReason] = useState('Deeper Exploration');

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
      coverGradient,
      coverEmoji,
      startDate: status === 'currently-reading' ? new Date().toISOString().split('T')[0] : undefined,
      description: description.trim() || 'A captivating addition to your reading list.',
      flowRecommendations: recTitle.trim() ? [
        {
          id: `rec-custom-${Date.now()}`,
          title: recTitle.trim(),
          author: recAuthor.trim() || 'Unknown Author',
          genre: 'Recommended Next',
          coverGradient: COVER_GRADIENTS[1],
          reasonTag: recReason,
          description: `Custom flow path after finishing ${title}`,
          estimatedPages: 300,
          matchScore: 95
        }
      ] : undefined
    };

    onAddBook(newBook);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-modal rounded-3xl max-w-2xl w-full p-6 lg:p-8 my-8 relative border border-amber-500/30 text-gray-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-xl font-bold text-gray-100">Add Book to Library</h2>
              <p className="text-xs text-gray-400">Configure book details & post-read flow</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Book Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Dune Messiah"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Author *</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Frank Herbert"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Genre & Pages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Genre</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g. Sci-Fi, Thriller"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Total Pages</label>
              <input
                type="number"
                min="1"
                required
                value={totalPages}
                onChange={(e) => setTotalPages(parseInt(e.target.value, 10) || 100)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as BookFormat)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-amber-500"
              >
                <option value="paperback">Paperback</option>
                <option value="hardcover">Hardcover</option>
                <option value="ebook">eBook</option>
                <option value="audiobook">Audiobook</option>
              </select>
            </div>
          </div>

          {/* Shelf Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Initial Shelf</label>
            <div className="grid grid-cols-3 gap-2">
              {(['currently-reading', 'up-next', 'want-to-read'] as ReadingStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    status === s
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-900 text-gray-400 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {s.replace('-', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Cover Color & Emoji */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">Cover Gradient & Icon</label>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {COVER_GRADIENTS.map((gradient, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCoverGradient(gradient)}
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} border-2 transition-all ${
                    coverGradient === gradient ? 'border-amber-400 scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setCoverEmoji(emoji)}
                  className={`p-1.5 rounded-lg text-base transition-all ${
                    coverEmoji === emoji ? 'bg-amber-500/20 border border-amber-400' : 'bg-slate-900 border border-slate-800'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Pre-configured Next Read Recommendation */}
          <div className="bg-purple-950/40 p-4 rounded-2xl border border-purple-500/30 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-purple-400" />
              Configure "What to Read Next" Post-Read Flow (Optional)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={recTitle}
                onChange={(e) => setRecTitle(e.target.value)}
                placeholder="Recommended Next Title"
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-gray-100"
              />
              <input
                type="text"
                value={recAuthor}
                onChange={(e) => setRecAuthor(e.target.value)}
                placeholder="Next Author"
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-gray-100"
              />
              <input
                type="text"
                value={recReason}
                onChange={(e) => setRecReason(e.target.value)}
                placeholder="e.g. Palate Cleanser"
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-gray-100"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Synopsis / Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of the book..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Book</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
