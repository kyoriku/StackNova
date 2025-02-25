import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
        404
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        Page not found
      </p>
      <Link 
        to="/"
        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
      >
        Return to Home
      </Link>
    </div>
  );
}

export default NotFound;