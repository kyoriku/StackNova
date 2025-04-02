import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useUpdatePost = (postId) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const updatePostMutation = useMutation({
    mutationFn: async (updatedPost) => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
        credentials: 'include' // Include credentials for cross-domain sessions
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update post');
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      // Navigate back to dashboard
      navigate('/dashboard');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleUpdatePost = (postData) => {
    setError('');

    if (!postData.title.trim() || !postData.content.trim()) {
      setError('Please fill in all fields');
      return;
    }

    updatePostMutation.mutate(postData);
  };

  return {
    error,
    isUpdating: updatePostMutation.isPending,
    updatePost: handleUpdatePost,
    clearError: () => setError('')
  };
};