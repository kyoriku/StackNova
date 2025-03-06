import React from 'react';

const PostSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 
                    border border-gray-200 dark:border-gray-700
                    animate-pulse shadow-md">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          {/* Title Skeleton */}
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-4"></div>

          {/* Excerpt Skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-15/16"></div>
          </div>

          {/* Author and Date Skeleton */}
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-1"></div>
        </div>

        {/* Chevron Skeleton */}
        {/* <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded"></div> */}
      </div>
    </div>
  );
};

const PostsSkeletonLoader = ({ count = 10 }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {[...Array(count)].map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  );
};

export default PostsSkeletonLoader;