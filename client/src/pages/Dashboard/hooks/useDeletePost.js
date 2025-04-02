import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeletePost = ({ userId, onSuccess }) => {
  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn: async (postId) => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }), // Send userId in the request body
        credentials: 'include' // Include credentials for cross-domain sessions
      });
      if (!response.ok) throw new Error('Failed to delete post');
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userPosts', userId] }),
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({ queryKey: ['user'] }),
      ]);
      
      // Call the onSuccess callback
      if (onSuccess) {
        onSuccess();
      }
    }
  });

  return { deletePostMutation };
};