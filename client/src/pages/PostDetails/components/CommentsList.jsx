import { MessageSquare } from 'lucide-react';
import { CommentItem } from './CommentItem';

export const CommentsList = ({ 
  comments,
  currentUserId,
  onEditComment,
  onDeleteComment,
  isEditingComment
}) => {
  if (!comments?.length) return null;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        <MessageSquare className="inline-block mr-2" size={24} />
        Comments
      </h2>
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUserId={currentUserId}
            onEdit={onEditComment}
            onDelete={onDeleteComment}
            isEditingAny={isEditingComment !== null}
          />
        ))}
      </div>
    </div>
  );
};