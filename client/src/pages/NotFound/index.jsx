import { Link } from 'react-router-dom';
import { SEO } from '../../components/SEO';

function NotFound({
  code = "404",
  title = "Page not found",
  message,
  linkText = "Return to Home",
  linkTo = "/"
}) {
  // Determine a descriptive title for SEO based on props
  const seoTitle = code === "404" ? "Page Not Found - 404" : `${title} - ${code}`;
  
  // Create a descriptive meta description
  const seoDescription = message || 
    "The page you're looking for doesn't exist or has been moved. Please navigate back to the home page.";

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        noIndex={true} // Error pages should not be indexed
      />
      
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
    </>
  );
}

export default NotFound;