import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import MarkdownEditor from '../components/MarkdownEditor';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  // Fetch existing post
  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${id}`);
      if (!response.ok) throw new Error('Failed to fetch post');
      return response.json();
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  // Set form data when post is loaded
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  // Verify post ownership
  useEffect(() => {
    if (post && user && post.user_id !== user.id) {
      navigate('/dashboard');
    }
  }, [post, user, navigate]);

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: async (updatedPost) => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update post');
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      // Navigate back to dashboard
      navigate('/dashboard');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Please fill in all fields');
      return;
    }

    updatePostMutation.mutate({ title, content });
  };

  if (isLoadingPost) {
    return <LoadingSpinner text="Loading post..." />;
  }

  return (
    <div className="max-w-4xl mx-auto pb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Edit Post
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900/50 
                     rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg
                     bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-white 
                     border border-gray-200 dark:border-gray-600
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                    "
            placeholder="Enter post title"
            disabled={updatePostMutation.isPending}
            required
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
          >
            Content
          </label>
          <MarkdownEditor
            content={content}
            onChange={setContent}
            disabled={updatePostMutation.isPending}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-lg
                     bg-gray-100 dark:bg-gray-700
                     text-gray-700 dark:text-gray-300
                     hover:bg-gray-200 dark:hover:bg-gray-600
                     disabled:opacity-50 disabled:cursor-not-allowed
                     cursor-pointer"
            disabled={updatePostMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updatePostMutation.isPending}
            className="px-4 py-2 rounded-lg min-w-[122px]
                     bg-blue-600 text-white
                     hover:bg-blue-700
                     disabled:opacity-50 disabled:cursor-not-allowed
                     cursor-pointer
                     flex items-center justify-center"
          >
            {updatePostMutation.isPending ? (
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-[-0.125em]" />
            ) : (
              'Update Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;