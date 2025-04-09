import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { POST_LIMITS } from '../constants';
import { validateCodeBlocks } from '../utils';

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
        credentials: 'include' // Include credentials for cross-domain sessions
      });

      const responseData = await response.json();

      if (!response.ok) {
        // If the server returned validation errors, format them nicely
        if (responseData.errors && Array.isArray(responseData.errors)) {
          const errorMessages = responseData.errors.map(err => err.msg).join('. ');
          throw new Error(errorMessages || 'Failed to create post');
        }
        throw new Error(responseData.message || 'Failed to create post');
      }

      return responseData;
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

    // Client-side validation with specific error messages
    if (!postData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (postData.title.trim().length > POST_LIMITS.TITLE_MAX) {
      setError(`Title must be less than ${POST_LIMITS.TITLE_MAX} characters`);
      return;
    }

    if (!postData.content.trim()) {
      setError('Content is required');
      return;
    }

    if (postData.content.trim().length < POST_LIMITS.CONTENT_MIN) {
      setError(`Content must be at least ${POST_LIMITS.CONTENT_MIN} characters`);
      return;
    }

    if (postData.content.trim().length > POST_LIMITS.CONTENT_MAX) {
      setError(`Content must be less than ${POST_LIMITS.CONTENT_MAX} characters`);
      return;
    }

    // Validate code blocks
    if (!validateCodeBlocks(postData.content)) {
      setError(`Code blocks must be less than ${POST_LIMITS.CODE_BLOCK_MAX} characters`);
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