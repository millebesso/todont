import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-6">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          List Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The list you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Create a New List
        </button>
      </div>
    </div>
  );
}
