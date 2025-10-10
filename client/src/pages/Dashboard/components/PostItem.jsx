import { Link } from 'react-router-dom';
import { Edit2, Trash2, Calendar } from 'lucide-react';
import { ResponsiveDate } from '../../../components/ResponsiveDate';

export const PostItem = ({ post, onDeleteClick, prefetchPost }) => (
  <article
    className="relative bg-gradient-to-br from-white to-gray-50/50 
             dark:from-gray-800 dark:to-gray-800/50
             rounded-2xl p-4 sm:p-6
             border border-gray-200/60 dark:border-gray-700/60
             hover:border-blue-300 dark:hover:border-blue-500/50
             transition-all duration-300 ease-out
             hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20
             hover:-translate-y-1
             shadow-sm shadow-gray-900/5 dark:shadow-black/20
             overflow-hidden
             group"
    aria-labelledby={`post-title-${post.slug}`}
  >
    <div className="relative z-10">
      <h3 id={`post-title-${post.slug}`} className="mb-2">
        <Link
          to={`/post/${post.slug}`}
          className="text-xl font-bold text-gray-900 dark:text-white
                   group-hover:text-transparent group-hover:bg-clip-text 
                   group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600
                   dark:group-hover:from-blue-400 dark:group-hover:to-purple-400
                   transition-none
                   leading-tight"
          onMouseEnter={() => prefetchPost(post.slug)}
        >
          {post.title}
        </Link>
      </h3>

      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">
        {post.excerpt}
      </p>

      <footer className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2 
                      px-2.5 py-1 rounded-full
                      bg-gray-100 dark:bg-gray-700/50
                      transition-colors duration-300">
          <Calendar className="w-3 h-3 text-gray-500 dark:text-gray-400" />
          <ResponsiveDate
            date={post.createdAt}
            className="text-gray-500 dark:text-gray-400 text-sm font-medium"
          />
        </div>

        <div className="flex gap-2">
          <Link
            to={`/edit-post/${post.slug}`}
            className="p-2 rounded-lg
                     text-gray-600 dark:text-gray-400 
                     hover:text-blue-600 dark:hover:text-blue-400
                     hover:bg-blue-50 dark:hover:bg-blue-900/20
                     transition-all duration-200 cursor-pointer"
            aria-label={`Edit post: ${post.title}`}
            onMouseEnter={() => prefetchPost(post.slug)}
          >
            <Edit2 size={16} aria-hidden="true" />
          </Link>
          <button
            onClick={() => onDeleteClick(post)}
            className="p-2 rounded-lg
                     text-gray-600 dark:text-gray-400 
                     hover:text-red-600 dark:hover:text-red-400
                     hover:bg-red-50 dark:hover:bg-red-900/20
                     transition-all duration-200 cursor-pointer"
            aria-label={`Delete post: ${post.title}`}
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </footer>
    </div>

    {/* Decorative corner accent */}
    <div className="absolute top-0 right-0 w-32 h-32 
                  bg-gradient-to-br from-blue-500/5 to-purple-500/5
                  dark:from-blue-500/10 dark:to-purple-500/10
                  rounded-full blur-3xl
                  group-hover:scale-150 transition-transform duration-500
                  -z-0" />
  </article>
);