import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTodontList } from '../hooks/useTodontList';
import { TodontItem } from './TodontItem';

export function TodontList() {
  const { id } = useParams<{ id: string }>();
  const { list, loading, error, addItem, toggleItem, updateItem, deleteItem } = useTodontList(id);
  const [description, setDescription] = useState('');
  const [avoidUntil, setAvoidUntil] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    try {
      setSubmitting(true);
      const date = avoidUntil ? new Date(avoidUntil) : undefined;
      await addItem(description, date);
      setDescription('');
      setAvoidUntil('');
    } catch (err) {
      console.error('Failed to add item:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!list) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* Logo and Title Row */}
      <div className="w-full max-w-7xl mx-auto mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_42rem_1fr] gap-8 items-center">
          {/* Left: Logo */}
          <div className="hidden lg:flex justify-center">
            <a
              href="/"
              className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors inline-block logo-font"
            >
              TODONT
            </a>
          </div>

          {/* Center: List Name */}
          <div className="w-full max-w-2xl mx-auto lg:mx-0">
            <h1 className="text-3xl font-bold text-gray-900 text-center">{list.name}</h1>
          </div>

          {/* Right: Empty for balance */}
          <div className="hidden lg:block"></div>
        </div>

        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-6 left-6">
          <a
            href="/"
            className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors inline-block logo-font"
          >
            TODONT
          </a>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_42rem_1fr] gap-8 items-start">
        {/* Left side - Explanation text panel */}
        <div className="hidden lg:flex justify-center">
          <div className="bg-blue-50 rounded-lg p-5 border border-blue-100 w-64 sticky top-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Tasks to don't do
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              Add a todont-item to remember what not to do.
            </p><br/>
            <p className="text-xs text-gray-700 leading-relaxed">
              Each item has a title and an optional "avoid until"-date.
              A todont-item starts checked because it's something you do
              but want to avoid doing. It's not until the item has been
              avoided that it should be unchecked.
            </p><br/>
            <p className="text-xs text-gray-700 leading-relaxed">
              The "avoid until"-date indicates at what date a todont-item
              can be considered avoided and it is not until then that
              it can be unchecked.
           </p>
          </div>
        </div>

        {/* Center - Main content */}
        <div className="w-full max-w-2xl mx-auto lg:mx-0">

          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            {list.items.length === 0 ? (
              <p className="text-gray-500 italic">No items yet. Add one below!</p>
            ) : (
              <div className="space-y-1">
                {list.items.map((item) => (
                  <TodontItem
                    key={item.id}
                    item={item}
                    onToggle={toggleItem}
                    onUpdate={updateItem}
                    onDelete={deleteItem}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Add Item
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Eat candy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="avoidUntil"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Avoid Until (optional)
                </label>
                <input
                  id="avoidUntil"
                  type="date"
                  value={avoidUntil}
                  onChange={(e) => setAvoidUntil(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !description.trim()}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Adding...' : 'Add Item'}
              </button>
            </form>
          </div>
        </div>

        {/* Right side - Empty space for balance */}
        <div className="hidden lg:block"></div>
      </div>
    </div>
  );
}
