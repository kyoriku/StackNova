import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export const useCreatePost = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const createPostMutation = useMutation({
    mutationFn: async (postData) => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create post');
      }
      return response.json();
    },
    onSuccess: async (newPost) => {
      // First invalidate the queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userPosts', user?.id] }),
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({ queryKey: ['user'] })
      ]);
      
      // Then update the cache optimistically
      const currentPosts = queryClient.getQueryData(['userPosts', user?.id]) || [];
      if (Array.isArray(currentPosts)) {
        // Add the new post to the existing posts
        queryClient.setQueryData(['userPosts', user?.id], [newPost, ...currentPosts]);
      }
      
      // Navigate to dashboard
      navigate('/dashboard');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleCreatePost = (postData) => {
    setError('');

    if (!postData.title.trim() || !postData.content.trim()) {
      setError('Please fill in all fields');
      return;
    }

    createPostMutation.mutate(postData);
  };

  return {
    error,
    isCreating: createPostMutation.isPending,
    createPost: handleCreatePost,
    clearError: () => setError('')
  };
};