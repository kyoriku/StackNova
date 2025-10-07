import { Search, X } from 'lucide-react';

export const SearchBar = ({
  searchTerm,
  setSearchTerm,
  resultsCount,
  onClear,
  lastBrowsePage
}) => {
  const clearSearch = () => {
    if (onClear) {
      onClear();
    } else {
      setSearchTerm('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const clearButtonTitle = lastBrowsePage
    ? `Clear search and return to page ${lastBrowsePage}`
    : 'Clear search';

  return (
    <div aria-label="Search posts" className="w-full relative group">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 
                    rounded-2xl opacity-0 group-hover:opacity-100 blur-xl 
                    transition-opacity duration-500 -z-10" />

      <div role="search" className="relative">
        <label htmlFor="search-input" className="sr-only">Search posts</label>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 
                           group-hover:text-blue-500 dark:group-hover:text-blue-400 
                           transition-colors duration-300" />
        </div>
        <input
          id="search-input"
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-11 py-3 rounded-2xl
                   bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                   text-gray-900 dark:text-gray-100 
                   border-2 border-gray-200 dark:border-gray-700
                   shadow-lg shadow-gray-900/5 dark:shadow-black/20
                   focus:outline-none focus:border-blue-500 dark:focus:border-blue-400
                   focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30
                   placeholder:text-gray-400 dark:placeholder:text-gray-500
                   transition-all duration-300"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            title={clearButtonTitle}
            className="absolute inset-y-0 right-0 pr-4 flex items-center 
                       text-gray-400 hover:text-gray-600 
                       dark:text-gray-500 dark:hover:text-gray-300
                       hover:scale-110
                       cursor-pointer transition-all duration-200 z-10"
            aria-label={clearButtonTitle}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="absolute top-full mt-1.5 right-0 w-full h-6">
        {searchTerm && (
          <p role="status" aria-live="polite"
            className="text-sm text-right text-gray-600 dark:text-gray-400 font-semibold">
            {resultsCount} {resultsCount === 1 ? 'result' : 'results'}
          </p>
        )}
      </div>
    </div>
  );
};