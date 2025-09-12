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
      onClear(); // Use the parent's clear handler for URL management
    } else {
      setSearchTerm(''); // Fallback to direct state update
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission behavior
    }
  };

  // Generate tooltip text for clear button
  const clearButtonTitle = lastBrowsePage 
    ? `Clear search and return to page ${lastBrowsePage}`
    : 'Clear search';

  return (
    <div aria-label="Search posts" className="w-full relative">
      <form role="search" onSubmit={(e) => e.preventDefault()} className="relative">
        <label htmlFor="search-input" className="sr-only">Search posts</label>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="search-input"
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown} // Prevent Enter key from clearing input
          className="w-full pl-10 pr-10 py-1 rounded-xl
                   bg-white dark:bg-gray-800 
                   text-gray-900 dark:text-white 
                   border-2 border-gray-200 dark:border-gray-700
                   shadow-sm dark:shadow-md dark:shadow-black/10
                   focus:outline-none focus:border-blue-500 focus:ring-2 
                   focus:ring-blue-200 dark:focus:ring-blue-800
                   placeholder-gray-500 dark:placeholder-gray-400"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            title={clearButtonTitle}
            className="absolute inset-y-0 right-0 pr-3 flex items-center 
                       text-gray-400 hover:text-gray-600 
                       dark:hover:text-gray-300
                       cursor-pointer"
            aria-label={clearButtonTitle}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </form>

      {/* Absolutely positioned container to prevent layout shift */}
      <div className="absolute top-full mt-1.5 right-0 w-full h-6">
        {searchTerm && (
          <p role="status" aria-live="polite" className="text-sm text-right text-gray-600 dark:text-gray-400">
            Found {resultsCount} {resultsCount === 1 ? 'post' : 'posts'}
          </p>
        )}
      </div>
    </div>
  );
};