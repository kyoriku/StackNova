import { PostsSkeletonLoader } from './PostsSkeletonLoader';
import { PostsList } from './PostsList';
import { AlertCircle, Frown } from 'lucide-react';

export const PostsContainer = ({ isLoading, error, posts, prefetchPost }) => {
  if (isLoading) return <PostsSkeletonLoader />;

  if (error) return (
    <section
      aria-label="Error message"
      className="p-6 rounded-2xl 
               bg-gradient-to-br from-red-50 to-red-100/50
               dark:from-red-900/20 dark:to-red-900/10
               border-2 border-red-200 dark:border-red-800/50
               shadow-lg shadow-red-500/10 dark:shadow-black/20"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full 
                      bg-red-100 dark:bg-red-900/30
                      flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-red-900 dark:text-red-200 mb-1">
            Error loading posts
          </h2>
          <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
            {error.message}
          </p>
        </div>
      </div>
    </section>
  );

  if (posts.length === 0) return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 
                    rounded-full bg-gradient-to-br from-gray-100 to-gray-200
                    dark:from-gray-800 dark:to-gray-700 mb-4
                    shadow-lg shadow-gray-900/5 dark:shadow-black/20">
        <Frown className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-lg font-semibold mb-1">
        No posts found
      </p>
      <p className="text-gray-400 dark:text-gray-500 text-sm">
        Try adjusting your search terms
      </p>
    </div>
  );

  return <PostsList posts={posts} prefetchPost={prefetchPost} />;
};