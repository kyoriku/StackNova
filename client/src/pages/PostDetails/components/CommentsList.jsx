import { useState } from 'react';
import { MessageSquare, ArrowUpDown } from 'lucide-react';
import { CommentItem } from './CommentItem';

export const CommentsList = ({
  comments,
  currentUserId,
  onEditComment,
  onDeleteComment,
  isEditingComment
}) => {
  const [sortBy, setSortBy] = useState('newest');

  if (!comments?.length) return null;

  // Sort comments based on the selected sort option
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          <MessageSquare className="inline-block mr-2" size={24} />
          Comments
        </h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
          rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none 
          focus:ring-2 focus:ring-blue-500"
          aria-label="Sort comments"
        >
          <option value="newest">Newest Comments</option>
          <option value="oldest">Oldest Comments</option>
        </select>
      </div>
      <div className="space-y-4">
        {sortedComments.map((comment) => (
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