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
      <h4
        id="comment-form"
        className="text-2xl font-black bg-gradient-to-r 
                 from-gray-900 via-blue-800 to-purple-800 
                 dark:from-gray-100 dark:via-blue-300 dark:to-purple-300
                 bg-clip-text text-transparent mb-4"
      >
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
          <div className="mt-3 p-4 rounded-2xl
                        bg-gradient-to-br from-red-50 to-red-100/50
                        dark:from-red-900/20 dark:to-red-900/10
                        border-2 border-red-200 dark:border-red-800/50
                        shadow-sm shadow-red-500/10 dark:shadow-black/20">
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Character counter on left, buttons on right */}
        <div className="mt-3 flex justify-between items-center">
          {/* Character counter */}
          <div
            className={`text-sm font-semibold ${isOverLimit ? 'text-red-600 dark:text-red-400' :
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
                className="px-5 py-2.5 rounded-xl
                         bg-white dark:bg-gray-800 
                         text-gray-700 dark:text-gray-300
                         border-2 border-gray-200 dark:border-gray-700
                         hover:bg-gray-50 dark:hover:bg-gray-750
                         hover:border-gray-300 dark:hover:border-gray-600
                         font-semibold text-sm
                         transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl
                       bg-gradient-to-r from-blue-500 to-purple-500
                       dark:from-blue-600 dark:to-purple-600
                       text-white font-semibold text-sm
                       hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-500/40
                       hover:scale-105
                       transition-all duration-200 cursor-pointer 
                       disabled:opacity-50 disabled:cursor-not-allowed 
                       disabled:hover:scale-100 disabled:hover:shadow-none
                       min-w-[140px]"
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