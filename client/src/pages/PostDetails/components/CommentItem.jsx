import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Edit2, Trash2, User } from 'lucide-react';
import { MarkdownPreview } from '../../../components/MarkdownEditor';
import { usePrefetchUserProfile } from '../hooks/usePrefetchUserProfile';

export const CommentItem = ({ comment, currentUserId, onEdit, onDelete, isEditingAny }) => {
  const prefetchUserProfile = usePrefetchUserProfile();

  return (
    <div className="relative bg-gradient-to-br from-white to-gray-50/50 
                  dark:from-gray-800 dark:to-gray-800/50
                  rounded-2xl p-4 sm:p-6 
                  border border-gray-200/60 dark:border-gray-700/60
                  shadow-sm shadow-gray-900/5 dark:shadow-black/20
                  overflow-hidden">

      <div className="relative z-10">
        <div className="text-gray-900 dark:text-gray-100 mb-4 prose dark:prose-invert max-w-none">
          <MarkdownPreview content={comment.comment_text} showLineNumbers={false} />
        </div>

        <hr className='mb-4 border-gray-200/60 dark:border-gray-700/60' />

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 
                          px-2.5 py-1 rounded-full
                          bg-gray-100 dark:bg-gray-700/50
                          transition-colors duration-300">
              <User className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              <Link
                to={`/user/${comment.user.username}`}
                className="font-semibold text-gray-700 dark:text-gray-200 text-xs
                         hover:text-blue-600 dark:hover:text-blue-400
                         transition-colors duration-200"
                onMouseEnter={() => prefetchUserProfile(comment.user.username)}
              >
                {comment.user.username}
              </Link>
            </div>

            <time dateTime={comment.createdAt} className="text-gray-500 dark:text-gray-400 font-medium text-xs">
              {format(new Date(comment.createdAt), 'MMMM d, yyyy')}
            </time>
          </div>

          {comment.user_id === currentUserId && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(comment)}
                className="p-2 rounded-lg
                         text-gray-600 dark:text-gray-400 
                         hover:text-blue-600 dark:hover:text-blue-400
                         hover:bg-blue-50 dark:hover:bg-blue-900/20
                         transition-all duration-200 cursor-pointer
                         disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isEditingAny}
                aria-label="Edit comment"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(comment)}
                className="p-2 rounded-lg
                         text-gray-600 dark:text-gray-400 
                         hover:text-red-600 dark:hover:text-red-400
                         hover:bg-red-50 dark:hover:bg-red-900/20
                         transition-all duration-200 cursor-pointer"
                aria-label="Delete comment"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 
                    bg-gradient-to-br from-blue-500/5 to-purple-500/5
                    dark:from-blue-500/10 dark:to-purple-500/10
                    rounded-full blur-3xl -z-0" />
    </div>
  );
};