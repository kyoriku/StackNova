import { Link } from 'react-router-dom';
import { PostItem } from './PostItem';

export const PostsList = ({ posts, onDeleteClick, prefetchPost }) => {
  if (!posts) {
    return (
      <section className="text-center py-8" aria-labelledby="loading-state">
        <h2 id="loading-state" className="sr-only">Loading posts</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Loading posts data...
        </p>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="text-center py-8" aria-labelledby="empty-state">
        <h2 id="empty-state" className="sr-only">No posts found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You haven't created any posts yet.
        </p>
        <Link
          to="/new-post"
          className="text-blue-600 dark:text-blue-400 
                 [&:hover]:text-blue-700 dark:[&:hover]:text-blue-300"
        >
          Create your first post
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4" aria-labelledby="your-posts-heading">
      <h2 id="your-posts-heading" className="sr-only">Your posts</h2>
      <ul className="list-none p-0 m-0 space-y-4" role="list">
        {posts.map((post) => (
          <li key={post.id}>
            <PostItem
              post={post}
              onDeleteClick={onDeleteClick}
              prefetchPost={prefetchPost}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};