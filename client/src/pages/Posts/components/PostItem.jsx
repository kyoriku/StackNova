import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MessageSquare, User } from 'lucide-react';

export const PostItem = ({ post, prefetchPost }) => {
  const commentCount = post.comments?.length || post.commentCount || 0;

  return (
    <article className="group">
      <Link
        to={`/post/${post.slug}`}
        onMouseEnter={() => prefetchPost(post.slug)}
        className="block"
        aria-labelledby={`post-title-${post.slug}`}
      >
        <div className="relative bg-gradient-to-br from-white to-gray-50/50 
                      dark:from-gray-800 dark:to-gray-800/50
                      rounded-2xl p-4 sm:p-6
                      border border-gray-200/60 dark:border-gray-700/60
                      hover:border-blue-300 dark:hover:border-blue-500/50
                      transition-all duration-300 ease-out
                      hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20
                      hover:-translate-y-1
                      shadow-sm shadow-gray-900/5 dark:shadow-black/20
                      overflow-hidden
                      before:absolute before:inset-0 before:rounded-2xl
                      before:bg-gradient-to-br before:from-blue-500/0 before:to-purple-500/0
                      hover:before:from-blue-500/5 hover:before:to-purple-500/5
                      dark:hover:before:from-blue-500/10 dark:hover:before:to-purple-500/10
                      before:transition-all before:duration-300">

          {/* Content wrapper */}
          <div className="relative z-10">
            <h2
              id={`post-title-${post.slug}`}
              className="text-xl font-bold text-gray-900 dark:text-white mb-2
                       group-hover:text-transparent group-hover:bg-clip-text 
                       group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600
                       dark:group-hover:from-blue-400 dark:group-hover:to-purple-400
                       transition-none
                       leading-tight"
            >
              {post.title}
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 
                        leading-relaxed">
              {post.excerpt}
            </p>

            {/* Meta info with modern styling */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 
                            px-2.5 py-1 rounded-full
                            bg-gray-100 dark:bg-gray-700/50
                            group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20
                            transition-colors duration-300">
                <User className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm">
                  {post.user.username}
                </span>
              </div>

              <time
                dateTime={post.createdAt}
                className="text-gray-500 dark:text-gray-400 font-medium text-sm"
              >
                {format(new Date(post.createdAt), 'MMM d, yyyy')}
              </time>

              <div className="ml-auto flex items-center gap-1.5
                            px-2.5 py-1 rounded-full
                            bg-gradient-to-r from-blue-50 to-purple-50
                            dark:from-blue-900/20 dark:to-purple-900/20
                            border border-blue-100 dark:border-blue-800/30
                            group-hover:from-blue-100 group-hover:to-purple-100
                            dark:group-hover:from-blue-900/30 dark:group-hover:to-purple-900/30
                            transition-all duration-300">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-blue-700 dark:text-blue-300 text-sm">
                  {commentCount}
                </span>
              </div>
            </div>
          </div>

          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 
                        bg-gradient-to-br from-blue-500/5 to-purple-500/5
                        dark:from-blue-500/10 dark:to-purple-500/10
                        rounded-full blur-3xl
                        group-hover:scale-150 transition-transform duration-500
                        -z-0" />
        </div>
      </Link>
    </article>
  );
};