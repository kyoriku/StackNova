import MarkdownEditor from '../../../components/MarkdownEditor';

export const CommentForm = ({
  commentText,
  setCommentText,
  isEditing,
  onSubmit,
  onCancelEdit,
  isSubmitting
}) => (
  <div className="mb-8">
    <h4 id="comment-form" className="text-xl font-semibold text-gray-900 dark:text-white mb-4 theme-transition">
      {isEditing ? 'Edit your comment' : 'Share your thoughts!'}
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
      <div className="mt-2 flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg
                   hover:bg-blue-700 transition-colors cursor-pointer 
                   disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-[-0.125em]" />
          ) : (
            isEditing ? 'Save Changes' : 'Post Comment'
          )}
        </button>
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
      </div>
    </form>
  </div>
);