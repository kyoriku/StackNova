import MarkdownEditor from '../../../components/MarkdownEditor';

export const CommentForm = ({
  commentText,
  setCommentText,
  isEditing,
  onSubmit,
  onCancelEdit,
  isSubmitting,
  error
}) => {
  const maxLength = 7500;
  const remaining = maxLength - commentText.length;
  const isOverLimit = remaining < 0;

  return (
    <div className="mb-8">
      <h4 id="comment-form" className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {isEditing ? 'Edit your comment' : 'Add a comment'}
      </h4>
      <form onSubmit={onSubmit}>
        <MarkdownEditor
          content={commentText}
          onChange={setCommentText}
          rows={6}
          preview={false}
          showLineNumbers={false}
          placeholder="Type your comment here..."
          disabled={isSubmitting}
        />

        {/* Error message */}
        {error && (
          <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 
                        dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Character counter on left, buttons on right */}
        <div className="mt-2 flex justify-between items-center">
          {/* Character counter */}
          <div 
            className={`text-sm ${
              isOverLimit ? 'text-red-600 dark:text-red-400' : 
              remaining < 500 ? 'text-yellow-600 dark:text-yellow-400' : 
              'text-gray-500 dark:text-gray-400'
            }`}
            aria-label="Character count"
          >
            {commentText.length} / {maxLength}
            {isOverLimit && ' (exceeds limit)'}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg
                         hover:bg-gray-600 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg
                       hover:bg-blue-700 transition-colors cursor-pointer 
                       disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
              disabled={isSubmitting || isOverLimit}
            >
              {isSubmitting ? (
                <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-[-0.125em]" />
              ) : (
                isEditing ? 'Save Changes' : 'Post Comment'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};