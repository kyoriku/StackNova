import { useState } from 'react';
import { PostItem } from '../../../pages/Posts/components/PostItem';
import { Pagination } from '../../../pages/Posts/components/Pagination';

export const UserPosts = ({ posts, prefetchPost }) => {
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });

  const paginatedPosts = sortedPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!posts?.length) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 theme-transition">
          Recent Posts
        </h2>
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 theme-transition">
          <p className="text-gray-600 dark:text-gray-400">No posts yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white theme-transition">
          Recent Posts
        </h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                   rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   theme-transition"
        >
          <option value="newest">Newest Posts</option>
          <option value="oldest">Oldest Posts</option>
        </select>
      </div>

      {paginatedPosts.map((post) => (
        <PostItem key={post.id} post={post} prefetchPost={prefetchPost} />
      ))}

      {posts.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(posts.length / ITEMS_PER_PAGE)}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};