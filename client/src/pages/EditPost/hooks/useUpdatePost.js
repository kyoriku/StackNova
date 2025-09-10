import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { POST_LIMITS } from '../../NewPost/constants';
import { validateCodeBlocks } from '../../NewPost/utils';

export const useUpdatePost = (postSlug) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const updatePostMutation = useMutation({
    mutationFn: async (updatedPost) => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
        credentials: 'include'
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.errors && Array.isArray(responseData.errors)) {
          const errorMessages = responseData.errors.map(err => err.msg).join('. ');
          throw new Error(errorMessages || 'Failed to update post');
        }
        throw new Error(responseData.message || 'Failed to update post');
      }

      return responseData;
    },
    onMutate: async (updatedPostData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['post', postSlug] });
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      await queryClient.cancelQueries({ queryKey: ['userPosts', user?.id] });
      if (user?.username) {
        await queryClient.cancelQueries({ queryKey: ['user', user.username] });
      }

      // Snapshot the previous values
      const previousPost = queryClient.getQueryData(['post', postSlug]);
      const previousPosts = queryClient.getQueryData(['posts']);
      const previousUserPosts = queryClient.getQueryData(['userPosts', user?.id]);
      const previousUserProfile = user?.username ? queryClient.getQueryData(['user', user.username]) : null;

      // Create optimistic updated post
      const optimisticPost = {
        ...previousPost,
        title: updatedPostData.title,
        content: updatedPostData.content,
        excerpt: updatedPostData.content.substring(0, 150) + '...',
        updatedAt: new Date().toISOString(),
        // Note: slug might change on server, but we'll use the old one optimistically
      };

      // Optimistically update individual post cache
      queryClient.setQueryData(['post', postSlug], optimisticPost);

      // Optimistically update posts list
      if (Array.isArray(previousPosts)) {
        const updatedPosts = previousPosts.map(post =>
          (post.slug === postSlug || post.id === previousPost?.id) ? optimisticPost : post
        );
        queryClient.setQueryData(['posts'], updatedPosts);
      }

      // Optimistically update user posts
      if (Array.isArray(previousUserPosts)) {
        const updatedUserPosts = previousUserPosts.map(post =>
          (post.slug === postSlug || post.id === previousPost?.id) ? optimisticPost : post
        );
        queryClient.setQueryData(['userPosts', user?.id], updatedUserPosts);
      }

      // Optimistically update user profile
      if (user?.username && previousUserProfile) {
        queryClient.setQueryData(['user', user.username], {
          ...previousUserProfile,
          posts: previousUserProfile.posts?.map(post =>
            (post.slug === postSlug || post.id === previousPost?.id) ? optimisticPost : post
          ) || []
        });
      }

      return {
        previousPost,
        previousPosts,
        previousUserPosts,
        previousUserProfile,
        optimisticPost
      };
    },
    onError: (err, updatedPostData, context) => {
      // Rollback on error
      if (context?.previousPost) {
        queryClient.setQueryData(['post', postSlug], context.previousPost);
      }
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      if (context?.previousUserPosts) {
        queryClient.setQueryData(['userPosts', user?.id], context.previousUserPosts);
      }
      if (context?.previousUserProfile && user?.username) {
        queryClient.setQueryData(['user', user.username], context.previousUserProfile);
      }

      setError(err.message);
    },
    onSuccess: async (data, variables, context) => {
      const newSlug = data.post?.slug || postSlug;
      const realPost = data.post;

      // Update with real data from server
      queryClient.setQueryData(['post', newSlug], realPost);

      // If slug changed, remove old cache entry and navigate to new URL
      if (newSlug !== postSlug) {
        queryClient.removeQueries({ queryKey: ['post', postSlug] });
      }

      // Update posts list with real data
      queryClient.setQueryData(['posts'], (oldPosts) => {
        if (!Array.isArray(oldPosts)) return oldPosts;
        return oldPosts.map(post =>
          (post.slug === postSlug || post.id === realPost?.id) ? realPost : post
        );
      });

      // Update user posts with real data
      queryClient.setQueryData(['userPosts', user?.id], (oldPosts) => {
        if (!Array.isArray(oldPosts)) return oldPosts;
        return oldPosts.map(post =>
          (post.slug === postSlug || post.id === realPost?.id) ? realPost : post
        );
      });

      // Update user profile with real data
      if (user?.username) {
        queryClient.setQueryData(['user', user.username], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            posts: oldData.posts?.map(post =>
              (post.slug === postSlug || post.id === realPost?.id) ? realPost : post
            ) || []
          };
        });
      }

      navigate(`/post/${newSlug}`, { replace: true });
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts', user?.id] });
      if (user?.username) {
        queryClient.invalidateQueries({ queryKey: ['user', user.username] });
      }
    },
  });

  const handleUpdatePost = (postData) => {
    setError('');

    // Client-side validation
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