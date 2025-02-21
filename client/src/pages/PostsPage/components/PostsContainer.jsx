import { PostsSkeletonLoader } from './PostsSkeletonLoader';
import { PostsList } from './PostsList';

export const PostsContainer = ({ isLoading, error, posts, prefetchPost }) => {
  if (isLoading) return <PostsSkeletonLoader />;
  if (error) return (
    <section aria-label="Error message" className="text-red-500 text-center p-4 rounded-lg bg-red-100 dark:bg-red-500/10 max-w-4xl mx-auto">
      <h2 className="font-medium mb-1">Error loading posts</h2>
      <p className="text-sm">{error.message}</p>
    </section>
  );
  if (posts.length === 0) return <p role="status" className="text-gray-900 dark:text-white text-center theme-transition">No posts available.</p>;

  return <PostsList posts={posts} prefetchPost={prefetchPost} />;
};