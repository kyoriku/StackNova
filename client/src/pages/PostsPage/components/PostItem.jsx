import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronRight } from 'lucide-react';

export const PostItem = ({ post, prefetchPost }) => (
  <article className="h-full">
    <Link
      to={`/post/${post.id}`}
      onMouseEnter={() => prefetchPost(post.id)}
      className="block group h-full"
      aria-labelledby={`post-title-${post.id}`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 
                    border border-gray-200 dark:border-gray-700
                    hover:border-blue-500 dark:hover:border-blue-400
                    transition-transform duration-200 shadow-md h-full">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h2 id={`post-title-${post.id}`} className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
              {post.title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
              {post.excerpt}
            </p>
            <footer className="text-gray-600 dark:text-gray-400 text-sm">
              <time dateTime={post.createdAt}>
                {format(new Date(post.createdAt), 'MMMM d, yyyy')}
              </time>
              <span aria-hidden="true"> • </span>
              <span>{post.user.username}</span>
            </footer>
          </div>
          <ChevronRight 
            className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1 
                      transition-all duration-200 
                      group-hover:translate-x-1.5
                      group-hover:text-blue-500 
                      dark:group-hover:text-blue-400"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  </article>
);