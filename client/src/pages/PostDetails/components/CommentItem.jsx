import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';
import { MarkdownPreview } from '../../../components/MarkdownEditor';

export const CommentItem = ({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  isEditingAny
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 theme-transition border border-gray-200 dark:border-gray-700">
    <p className="text-gray-900 dark:text-white mb-2 theme-transition">
      <MarkdownPreview content={comment.comment_text} showLineNumbers={false} />
    </p>
    <div className="flex justify-between items-center">
      <p className="text-gray-600 dark:text-gray-400 text-sm theme-transition">
        <Link 
          to={`/user/${comment.user.username}`}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors font-medium underline-offset-2 hover:underline"
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