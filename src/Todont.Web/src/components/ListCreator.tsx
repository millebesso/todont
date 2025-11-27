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
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* Logo and Title Row */}
      <div className="w-full max-w-7xl mx-auto mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-start">
          {/* Left: Logo */}
          <div className="hidden lg:flex justify-center">
            <span className="text-2xl font-bold text-gray-900 inline-block">
              TODONT
            </span>
          </div>

          {/* Center: Title */}
          <div className="w-full max-w-2xl mx-auto lg:mx-0">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                To Don't
              </h1>
              <p className="text-gray-600">
                Track things you want to avoid doing
              </p>
            </div>
          </div>

          {/* Right: Empty for balance */}
          <div className="hidden lg:block"></div>
        </div>

        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-6 left-6">
          <span className="text-2xl font-bold text-gray-900 inline-block">
            TODONT
          </span>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-start">
        {/* Left side - Explanation text panel */}
        <div className="hidden lg:flex justify-center">
          <div className="bg-blue-50 rounded-lg p-5 border border-blue-100 w-64 sticky top-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              What is todont?
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              An app for breaking bad habits.
           </p><br/>
           <p className="text-xs text-gray-700 leading-relaxed">Unlike todo lists where items
              start unchecked, todont items start <strong>checked</strong> and
              the goal is to uncheck them. As you avoid performing the tasks,
              you can uncheck the items to show, well you didn't complete them.
            </p><br/>
            <p className="text-xs text-gray-700 leading-relaxed">
              If at any time you actually slip up and perform some task on the
              todont-list, check them again.
            </p>
          </div>
        </div>

        {/* Center - Main form */}
        <div className="w-full max-w-2xl mx-auto lg:mx-0">
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

        {/* Right side - Empty space for balance */}
        <div className="hidden lg:block"></div>
      </div>
    </div>
  );
}
