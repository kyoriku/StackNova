import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MarkdownPreview } from '../../../components/MarkdownEditor';
import { Pagination } from '../../../pages/Posts/components/Pagination';

export const UserComments = ({ comments, prefetchPost }) => {
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [expandedComments, setExpandedComments] = useState(new Set());

  const toggleComment = (commentId) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });

  const paginatedComments = sortedComments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!comments?.length) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Comments
        </h2>
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg border 
        border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">No comments yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Recent Comments
        </h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
          rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest Comments</option>
          <option value="oldest">Oldest Comments</option>
        </select>
      </div>

      {paginatedComments.map((comment) => (
        <div
          key={comment.id}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 
          dark:border-gray-700 shadow-md dark:shadow-xl dark:shadow-black/20"
        >
          {expandedComments.has(comment.id) ? (
            <div className="text-gray-900 dark:text-white mb-2">
              <MarkdownPreview content={comment.comment_text} showLineNumbers={false} />
              <button
                onClick={() => toggleComment(comment.id)}
                className="text-sm text-blue-600 dark:text-blue-400 font-medium 
                cursor-pointer hover:text-blue-700 dark:hover:text-blue-500"
              >
                Show less
              </button>
            </div>
          ) : (
            <div className="text-gray-900 dark:text-white mb-2">
              <p>{comment.excerpt}</p>
              {comment.comment_text.length > comment.excerpt.length && (
                <button
                  onClick={() => toggleComment(comment.id)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 
                  dark:hover:text-blue-500 mt-1 font-medium cursor-pointer"
                >
                  Read more
                </button>
              )}
            </div>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            on <Link
              to={`/post/${comment.post.slug}`}
              className="text-blue-600 dark:text-blue-400 font-medium underline-offset-2
              hover:text-blue-700 dark:hover:text-blue-500"
              onMouseEnter={() => prefetchPost(comment.post.slug)}
              onFocus={() => prefetchPost(comment.post.slug)}
            >
              {comment.post.title}
            </Link>
            <span aria-hidden="true"> • </span>
            <time dateTime={comment.createdAt}>
              {format(new Date(comment.createdAt), 'MMMM d, yyyy')}
            </time>
          </p>
        </div>
      ))}

      {comments.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(comments.length / ITEMS_PER_PAGE)}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};