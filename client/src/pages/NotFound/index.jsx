import { Link } from 'react-router-dom';

function NotFound({
  code = "404",
  title = "Page not found",
  message,
  linkText = "Return to Home",
  linkTo = "/"
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
        {code}
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
        {title}
      </p>
      {message && (
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-6 text-center">
          {message}
        </p>
      )}
      <Link
        to={linkTo}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
      >
        {linkText}
      </Link>
    </div>
  );
}

export default NotFound;