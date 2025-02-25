import { Search, X } from 'lucide-react';

export const SearchBar = ({ searchTerm, setSearchTerm, resultsCount }) => {
  const clearSearch = () => setSearchTerm('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission behavior
    }
  };

  return (
    <section aria-label="Search posts" className="max-w-2xl mx-auto mb-1">
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
          className="w-full pl-10 pr-10 py-3 rounded-xl
                   bg-white dark:bg-gray-700 
                   text-gray-900 dark:text-white 
                   border-2 border-gray-200 dark:border-gray-600
                   shadow-sm
                   focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
                   placeholder-gray-500 dark:placeholder-gray-400
                   theme-transition"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center 
                       text-gray-400 hover:text-gray-600 
                       dark:hover:text-gray-300
                       theme-transition cursor-pointer"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </form>

      {/* Fixed height container to prevent layout shift */}
      <div className="h-8 mt-3">
        {searchTerm && (
          <p role="status" aria-live="polite" className="text-center text-gray-600 dark:text-gray-400 theme-transition">
            Found {resultsCount} {resultsCount === 1 ? 'post' : 'posts'}
          </p>
        )}
      </div>
    </section>
  );
};