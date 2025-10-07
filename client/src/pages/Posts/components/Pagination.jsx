export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center mt-8 gap-2">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        className="px-5 py-2.5 rounded-xl
                 bg-white dark:bg-gray-800 
                 text-gray-700 dark:text-gray-300
                 border-2 border-gray-200 dark:border-gray-700
                 hover:bg-gray-50 dark:hover:bg-gray-750
                 hover:border-gray-300 dark:hover:border-gray-600
                 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/30
                 disabled:opacity-40 disabled:cursor-not-allowed 
                 disabled:hover:shadow-none disabled:hover:bg-white dark:disabled:hover:bg-gray-800
                 cursor-pointer
                 font-semibold text-sm
                 transition-all duration-200"
      >
        Previous
      </button>
      
      <div 
        className="px-4 py-2.5 text-gray-600 dark:text-gray-400 font-semibold text-sm
                 bg-white dark:bg-gray-800 rounded-xl 
                 shadow-sm border-2 border-gray-100 dark:border-gray-700"
        aria-live="polite"
        role="status"
      >
        Page{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r 
                       from-blue-600 to-purple-600 
                       dark:from-blue-400 dark:to-purple-400 font-bold">
          {currentPage}
        </span>
        {' '}of{' '}
        <span className="text-gray-900 dark:text-gray-100 font-bold">
          {totalPages}
        </span>
      </div>
      
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        className="px-5 py-2.5 rounded-xl
                 bg-gradient-to-r from-blue-500 to-purple-500
                 dark:from-blue-600 dark:to-purple-600
                 text-white
                 border-2 border-transparent
                 hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-500/40
                 hover:scale-105
                 disabled:opacity-40 disabled:cursor-not-allowed 
                 disabled:hover:shadow-none disabled:hover:scale-100
                 cursor-pointer
                 font-semibold text-sm
                 transition-all duration-200"
      >
        Next
      </button>
    </div>
  );
};