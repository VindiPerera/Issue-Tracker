// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-blue-600">404</h1>
        <p className="text-2xl font-medium text-gray-800 mt-4">Page Not Found</p>
        <p className="text-gray-600 mt-2">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}