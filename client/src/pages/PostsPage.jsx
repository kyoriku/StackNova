// src/pages/Homepage.jsx
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import PostsList from '../components/PostsList';
import PostsSkeletonLoader from '../components/PostsSkeletonLoader';

const ITEMS_PER_PAGE = 10;

const Homepage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });

  const prefetchPost = useCallback((postId) => {
    if (navigator.connection && navigator.connection.saveData) {
      return;
    }

    let timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      queryClient.prefetchQuery({
        queryKey: ['post', postId.toString()],
        queryFn: async () => {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`);
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        },
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [queryClient]);

  // Filter posts based on search
  const filteredPosts = posts?.filter(post => {
    const searchLower = searchTerm.toLowerCase();
    const postDate = format(parseISO(post.createdAt), 'MMMM yyyy').toLowerCase();

    // Check post fields
    const matchesPost =
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.user.username.toLowerCase().includes(searchLower) ||
      postDate.includes(searchLower);

    // Check comments if they exist
    const matchesComments = post.comments?.some(comment =>
      comment.comment_text.toLowerCase().includes(searchLower) ||
      comment.user.username.toLowerCase().includes(searchLower)
    ) || false;

    return !searchTerm || matchesPost || matchesComments;
  }) || [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Clear search function
  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="max-w-6xl mx-auto pb-8">
      <div className="max-w-2xl mx-auto mb-1">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Latest Posts
        </h1>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-xl
                     bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-white 
                     border-2 border-gray-200 dark:border-gray-600
                     shadow-sm
                     focus:outline-none focus:border-blue-500 focus:ring-2 
                     focus:ring-blue-200 dark:focus:ring-blue-800
                     placeholder-gray-500 dark:placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center 
                         text-gray-400 hover:text-gray-600 
                         dark:hover:text-gray-300
                        "
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Search Results Count */}
        <div className="h-8 mt-3">
          {searchTerm && (
            <p className="text-center text-gray-600 dark:text-gray-400">
              Found {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
            </p>
          )}
        </div>
      </div>

      {isLoading ? (
        <PostsSkeletonLoader />
      ) : error ? (
        <div className="text-red-500 text-center mt-8">{error.message}</div>
      ) : paginatedPosts.length === 0 ? (
        <p className="text-gray-900 dark:text-white text-center">No posts available.</p>
      ) : (
        <>
          <PostsList posts={paginatedPosts} prefetchPost={prefetchPost} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 
                         text-gray-900 dark:text-white border border-gray-200 
                         dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed 
                         cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-900 dark:text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 
                         text-gray-900 dark:text-white border border-gray-200 
                         dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed 
                         cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Homepage;