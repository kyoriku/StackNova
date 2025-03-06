// src/pages/SinglePost.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { Edit2, Trash2, MessageSquare, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MarkdownEditor, { MarkdownPreview } from '../components/MarkdownEditor';
import LoadingSpinner from '../components/LoadingSpinner';

const SinglePost = () => {
  const { id } = useParams();
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Effect to handle body scroll lock
  useEffect(() => {
    if (deleteModalOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    }
  }, [deleteModalOpen]);

  // Fetch post data
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${id}`);
      if (!response.ok) throw new Error('Failed to fetch post');
      return response.json();
    }
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (newComment) => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment)
      });
      if (!response.ok) throw new Error('Failed to add comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['post', id]);
      setCommentText('');
    }
  });

  // Edit comment mutation
  const editCommentMutation = useMutation({
    mutationFn: async ({ commentId, updatedText }) => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_text: updatedText })
      });
      if (!response.ok) throw new Error('Failed to edit comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['post', id]);
      setEditingCommentId(null);
      setCommentText('');
    }
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete comment');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['post', id]);
      setDeleteModalOpen(false);
      setCommentToDelete(null);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting comment:", {
      comment_text: commentText,
      post_id: id
    });

    if (editingCommentId) {
      editCommentMutation.mutate({
        commentId: editingCommentId,
        updatedText: commentText
      });
    } else {
      addCommentMutation.mutate({
        comment_text: commentText,
        post_id: id
      });
    }
  };


  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id);
    setCommentText(comment.comment_text);
    setTimeout(() => {
      document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDeleteClick = (comment) => {
    setCommentToDelete(comment);
    setDeleteModalOpen(true);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setCommentText('');
  };

  const handleConfirmDelete = () => {
    if (commentToDelete) {
      deleteCommentMutation.mutate(commentToDelete.id);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading post..." />;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error.message}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Comment
              </h3>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 
                         dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteCommentMutation.isPending}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 
             disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-w-[79px]"
              >
                {deleteCommentMutation.isPending ? (
                  <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-[-0.125em]" />
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Content */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {post.title}
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8 border border-gray-200 dark:border-gray-700">
        <p className="text-gray-900 dark:text-white mb-4">
          <MarkdownPreview content={post.content} />
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {format(new Date(post.createdAt), 'MMMM d, yyyy')} • {post.user.username}
        </p>
      </div>

      {/* Comment Section */}
      {isAuthenticated ? (
        <div className="mb-8">
          <h4 id="comment-form" className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {editingCommentId ? 'Edit your comment' : 'Share your thoughts!'}
          </h4>
          <form onSubmit={handleSubmit}>
            <MarkdownEditor
              content={commentText}
              onChange={setCommentText}
              rows={6}
              preview={false}
              showLineNumbers={false}
              placeholder="Type your comment here..."
              disabled={addCommentMutation.isPending || editCommentMutation.isPending}
            />
            <div className="mt-2 flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg
             hover:bg-blue-700 transition-colors cursor-pointer 
             disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                disabled={addCommentMutation.isPending || editCommentMutation.isPending}
              >
                {(addCommentMutation.isPending || editCommentMutation.isPending) ? (
                  <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-[-0.125em]" />
                ) : (
                  editingCommentId ? 'Save Changes' : 'Post Comment'
                )}
              </button>
              {editingCommentId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg
                           hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg text-center border border-gray-200 dark:border-gray-700">
          <p className="text-gray-900 dark:text-white">
            Please{' '}
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="text-blue-600 hover:text-blue-700"
            >
              log in
            </Link>{' '}
            to comment on this post.
          </p>
        </div>
      )}

      {/* Comments List */}
      {post.comments?.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            <MessageSquare className="inline-block mr-2" size={24} />
            Comments
          </h2>
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 "
              >
                <p className="text-gray-900 dark:text-white mb-2">
                  <MarkdownPreview content={comment.comment_text} showLineNumbers={false} />
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {comment.user.username} • {format(new Date(comment.createdAt), 'MMMM d, yyyy')}
                  </p>
                  {comment.user_id === user?.id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(comment)}
                        className="text-gray-700 dark:text-gray-400 hover:text-blue-500 cursor-pointer"
                        disabled={editingCommentId !== null}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(comment)}
                        className="text-gray-700 dark:text-gray-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePost;