import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';
import { MarkdownPreview } from '../../../components/MarkdownEditor';
import { usePrefetchUserProfile } from '../hooks/usePrefetchUserProfile';

export const CommentItem = ({ comment, currentUserId, onEdit, onDelete, isEditingAny }) => {
  const prefetchUserProfile = usePrefetchUserProfile();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border 
    border-gray-200 dark:border-gray-700">
      <p className="text-gray-900 dark:text-white mb-4">
        <MarkdownPreview content={comment.comment_text} showLineNumbers={false} />
      </p>
      <hr className='mb-4 border-gray-200 dark:border-gray-700'/>
      <div className="flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          <Link
            to={`/user/${comment.user.username}`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 
            dark:hover:text-blue-500 font-medium"
            onMouseEnter={() => prefetchUserProfile(comment.user.username)} // Prefetch on hover
          >
            {comment.user.username}
          </Link>
          <span aria-hidden="true"> • </span>
          <time dateTime={comment.createdAt}>
            {format(new Date(comment.createdAt), 'MMMM d, yyyy')}
          </time>
        </p>
        {comment.user_id === currentUserId && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(comment)}
              className="text-gray-700 dark:text-gray-400 hover:text-blue-500 cursor-pointer"
              disabled={isEditingAny}
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(comment)}
              className="text-gray-700 dark:text-gray-400 hover:text-red-500 cursor-pointer"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};