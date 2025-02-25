import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeletePost = ({ userId, onSuccess }) => {
  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn: async (postId) => {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete post');
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userPosts', userId] }),
        queryClient.invalidateQueries({ queryKey: ['posts'] })
      ]);
      
      // Call the onSuccess callback
      if (onSuccess) {
        onSuccess();
      }
    }
  });

  return { deletePostMutation };
};