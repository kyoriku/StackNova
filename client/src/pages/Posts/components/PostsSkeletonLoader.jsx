const PostSkeleton = () => {
  return (
    <div 
      role="status"
      aria-label="Loading post"
      className="bg-white dark:bg-gray-800 rounded-lg p-4 border 
      border-gray-200 dark:border-gray-700 animate-pulse shadow-md"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-4" />
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-15/16" />
          </div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-1" />
        </div>
      </div>
    </div>
  );
};

export const PostsSkeletonLoader = ({ count = 10 }) => {
  return (
    <div 
      className="max-w-5xl mx-auto space-y-4"
      aria-label={`Loading ${count} posts`}
      role="status"
    >
      {[...Array(count)].map((_, index) => (
        <PostSkeleton key={index} />
      ))}
      <div className="sr-only" aria-live="polite">Loading posts...</div>
    </div>
  );
};