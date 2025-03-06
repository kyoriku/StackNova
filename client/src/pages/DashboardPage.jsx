import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { PlusCircle, Edit2, Trash2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { usePrefetchPost } from './Posts/hooks/usePrefetchPost';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const prefetchPost = usePrefetchPost();

  // Effect to handle body scroll lock when modal is open
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

  // Fetch user's posts
  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ['userPosts', user?.id],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/user/posts`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    },
    enabled: !!user?.id,
    // Don't show loading state if we have cached data
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 1 minute
    cacheTime: 1000 * 60 * 30 // Cache for 5 minutes
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (postId) => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete post');
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userPosts', user?.id] }),
        queryClient.invalidateQueries({ queryKey: ['posts'] })
      ]);
      // Force immediate refetch
      await refetch();
      // Close modal and reset state
      setDeleteModalOpen(false);
      setPostToDelete(null);
    }
  });

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (postToDelete) {
      deletePostMutation.mutate(postToDelete.id);
    }
  };

  if (isLoading && !posts) { // Only show loading state if we don't have cached data
    return <LoadingSpinner text="Loading your posts..." />;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error.message}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Post
              </h3>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 
           cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete "{postToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg 
                         dark:text-gray-300 dark:bg-gray-700 
                         [&:hover]:bg-gray-200 dark:[&:hover]:bg-gray-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deletePostMutation.isPending}
                className="px-4 py-2 text-white bg-red-600 rounded-lg 
             hover:bg-red-700 
             disabled:opacity-50 disabled:cursor-not-allowed 
             cursor-pointer min-w-[79px]
             flex items-center justify-center"
              >
                {deletePostMutation.isPending ? (
                  <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-[-0.125em]" />
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div className="text-left w-full sm:w-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {user?.username}'s Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
            Manage your posts and content
          </p>
        </div>
        <Link
          to="/new-post"
          className="flex items-center gap-2 px-4 py-2 
             bg-blue-600 text-white rounded-lg
             [&:hover]:bg-blue-700 w-full sm:w-auto justify-center sm:justify-start"
        >
          <PlusCircle size={20} />
          New Post
        </Link>
      </div>

      {/* Posts Section */}
      {posts?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You haven't created any posts yet.
          </p>
          <Link
            to="/new-post"
            className="text-blue-600 dark:text-blue-400 
                     [&:hover]:text-blue-700 dark:[&:hover]:text-blue-300"
          >
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts?.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-xl 
                       dark:shadow-black/20 overflow-hidden 
                       border border-gray-200 dark:border-gray-700
                       hover:border-blue-500 dark:hover:border-blue-400"
            >
              <div className="p-4">
                <Link
                  to={`/post/${post.id}`}
                  className="text-xl font-semibold text-blue-600 dark:text-blue-400 
            hover:text-blue-700 dark:hover:text-blue-300 mb-2 block"
                  onMouseEnter={() => prefetchPost(post.id)} // Prefetch on hover
                >
                  {post.title}
                </Link>
                <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 dark:text-gray-400 text-sm ">
                    {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      to={`/edit-post/${post.id}`}
                      className="text-gray-700 dark:text-gray-400 hover:text-blue-500 cursor-pointer"
                    >
                      <Edit2 size={18} />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(post)}
                      className="text-gray-700 dark:text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;