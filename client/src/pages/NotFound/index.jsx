import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { SEO } from '../../components/SEO';

function NotFound({
  code = "404",
  title = "Page not found",
  message,
  linkText = "Return to Home",
  linkTo = "/"
}) {
  const seoTitle = code === "404" ? "Page Not Found - 404" : `${title} - ${code}`;
  
  const seoDescription = message || 
    "The page you're looking for doesn't exist or has been moved. Please navigate back to the home page.";

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        noIndex={true}
      />
      
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] px-4">
        <div className="relative bg-gradient-to-br from-white to-gray-50/50 
                      dark:from-gray-800 dark:to-gray-800/50
                      rounded-2xl p-12 max-w-2xl w-full text-center
                      border border-gray-200/60 dark:border-gray-700/60
                      shadow-xl shadow-gray-900/5 dark:shadow-black/20
                      overflow-hidden">
          
          {/* Decorative gradient accents */}
          <div className="absolute top-0 left-1/4 w-32 h-32 
                        bg-gradient-to-br from-blue-500/10 to-purple-500/10
                        dark:from-blue-500/20 dark:to-purple-500/20
                        rounded-full blur-3xl -z-0" />
          <div className="absolute bottom-0 right-1/4 w-32 h-32 
                        bg-gradient-to-br from-purple-500/10 to-blue-500/10
                        dark:from-purple-500/20 dark:to-blue-500/20
                        rounded-full blur-3xl -z-0" />
          
          <div className="relative z-10">
            {/* Error icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 
                          rounded-full bg-gradient-to-br from-gray-100 to-gray-200
                          dark:from-gray-700 dark:to-gray-600 mb-6
                          shadow-lg shadow-gray-900/5 dark:shadow-black/20">
              <AlertCircle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            
            {/* Error code */}
            <h1 className="text-7xl font-black bg-gradient-to-r 
                         from-gray-900 via-blue-800 to-purple-800 
                         dark:from-gray-100 dark:via-blue-300 dark:to-purple-300
                         bg-clip-text text-transparent mb-4">
              {code}
            </h1>
            
            {/* Title */}
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {title}
            </p>
            
            {/* Message */}
            {message && (
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                {message}
              </p>
            )}
            
            {/* Action button */}
            <Link
              to={linkTo}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                       bg-gradient-to-r from-blue-500 to-purple-500
                       dark:from-blue-600 dark:to-purple-600
                       text-white font-semibold
                       hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-500/40
                       hover:scale-105
                       transition-all duration-200"
            >
              <Home size={18} />
              {linkText}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFound;