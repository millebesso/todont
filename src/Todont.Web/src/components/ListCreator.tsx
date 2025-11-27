import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../utils/api';

export function ListCreator() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const response = await api.createList(name);
      navigate(`/l/${response.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            To Don't
          </h1>
          <p className="text-gray-600">
            Track things you want to avoid doing
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Create a New List
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="listName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                List Name
              </label>
              <input
                id="listName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., My Bad Habits"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create List'}
            </button>
          </form>

          <div className="mt-6 text-sm text-gray-600">
            <p>
              Once created, you'll get a unique URL to access your list.
              Make sure to bookmark it!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
