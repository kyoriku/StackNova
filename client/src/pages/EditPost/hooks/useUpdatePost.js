import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { POST_LIMITS } from '../../NewPost/constants';
import { validateCodeBlocks } from '../../NewPost/utils';

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
      
      const responseData = await response.json();
      
      if (!response.ok) {
        // If the server returned validation errors, format them nicely
        if (responseData.errors && Array.isArray(responseData.errors)) {
          const errorMessages = responseData.errors.map(err => err.msg).join('. ');
          throw new Error(errorMessages || 'Failed to update post');
        }
        throw new Error(responseData.message || 'Failed to update post');
      }
      
      return responseData;
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

    updatePostMutation.mutate(postData);
  };

  return {
    error,
    isUpdating: updatePostMutation.isPending,
    updatePost: handleUpdatePost,
    clearError: () => setError('')
  };
};