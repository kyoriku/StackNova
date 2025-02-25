export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8 gap-2">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 
                 text-gray-900 dark:text-white border border-gray-200 
                 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed 
                 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        Previous
      </button>
      <div 
        className="px-4 py-2 text-gray-900 dark:text-white"
        aria-live="polite"
        role="status"
      >
        Page {currentPage} of {totalPages}
      </div>
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 
                 text-gray-900 dark:text-white border border-gray-200 
                 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed 
                 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        Next
      </button>
    </div>
  );
};