import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';

export const PostItem = ({ post, onDeleteClick, prefetchPost }) => (
  <article
    className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-xl 
               dark:shadow-black/20 overflow-hidden 
               border border-gray-200 dark:border-gray-700
               hover:border-blue-500 dark:hover:border-blue-400"
    aria-labelledby={`post-title-${post.slug}`}
  >
    <div className="p-4">
      <h3 id={`post-title-${post.slug}`} className="mb-2">
        <Link
          to={`/post/${post.slug}`}
          className="text-xl font-semibold text-blue-600 dark:text-blue-400 
          hover:text-blue-700 dark:hover:text-blue-500"
          onMouseEnter={() => prefetchPost(post.slug)}
        >
          {post.title}
        </Link>
      </h3>
      <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
        {post.excerpt}
      </p>
      <footer className="flex justify-between items-center">
        <time
          dateTime={post.createdAt}
          className="text-gray-600 dark:text-gray-400 text-sm"
        >
          {format(new Date(post.createdAt), 'MMMM d, yyyy')}
        </time>
        <div className="flex gap-2">
          <Link
            to={`/edit-post/${post.slug}`}
            className="text-gray-700 dark:text-gray-400 hover:text-blue-500 cursor-pointer"
            aria-label={`Edit post: ${post.title}`}
            onMouseEnter={() => prefetchPost(post.slug)}
          >
            <Edit2 size={18} aria-hidden="true" />
          </Link>
          <button
            onClick={() => onDeleteClick(post)}
            className="text-gray-700 dark:text-gray-400 hover:text-red-500 cursor-pointer"
            aria-label={`Delete post: ${post.title}`}
          >
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </div>
      </footer>
    </div>
  </article>
);