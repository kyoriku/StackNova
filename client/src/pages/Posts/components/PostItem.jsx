import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronRight, MessageSquare } from 'lucide-react';

export const PostItem = ({ post, prefetchPost }) => {
  // Get comment count
  const commentCount = post.comments?.length || post.commentCount || 0;

  return (
    <article className="h-full">
      <Link
        to={`/post/${post.slug}`}
        onMouseEnter={() => prefetchPost(post.slug)}
        className="block group h-full"
        aria-labelledby={`post-title-${post.slug}`}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 
                      border border-gray-200 dark:border-gray-700
                      hover:border-blue-500 dark:hover:border-blue-400
                      shadow-md dark:shadow-xl dark:shadow-black/20 h-full">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h2
                id={`post-title-${post.slug}`}
                className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2 
                        group-hover:text-blue-700 dark:group-hover:text-blue-500"
              >
                {post.title}
              </h2>
              <p className="text-gray-900 dark:text-gray-300 mb-3 line-clamp-2">
                {post.excerpt}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <ChevronRight
                className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 
                group-hover:translate-x-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 
                transition-transform duration-200"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <span>{post.user.username}</span>
              <span aria-hidden="true">•</span>
              <time dateTime={post.createdAt}>
                {format(new Date(post.createdAt), 'MMMM d, yyyy')}
              </time>
            </div>
            <div className="flex items-center">
              <MessageSquare className="inline-block w-4 h-4 mr-1" aria-hidden="true" />
              <span>{commentCount}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};