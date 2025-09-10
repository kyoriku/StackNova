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
        credentials: 'include'
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.errors && Array.isArray(responseData.errors)) {
          const errorMessages = responseData.errors.map(err => err.msg).join('. ');
          throw new Error(errorMessages || 'Failed to create post');
        }
        throw new Error(responseData.message || 'Failed to create post');
      }

      return responseData;
    },
    onMutate: async (newPostData) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      await queryClient.cancelQueries({ queryKey: ['userPosts', user?.id] });
      if (user?.username) {
        await queryClient.cancelQueries({ queryKey: ['user', user.username] });
      }

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(['posts']);
      const previousUserPosts = queryClient.getQueryData(['userPosts', user?.id]);
      const previousUserProfile = user?.username ? queryClient.getQueryData(['user', user.username]) : null;

      // Create optimistic post object
      const optimisticPost = {
        id: `temp-${Date.now()}`, // Temporary ID
        title: newPostData.title,
        content: newPostData.content,
        excerpt: newPostData.content.substring(0, 150) + '...',
        slug: `temp-slug-${Date.now()}`, // Temporary slug
        user_id: user?.id,
        username: user?.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          username: user?.username
        },
        comments: []
      };

      // Optimistically update posts list
      if (Array.isArray(previousPosts)) {
        queryClient.setQueryData(['posts'], [optimisticPost, ...previousPosts]);
      }

      // Optimistically update user posts
      if (Array.isArray(previousUserPosts)) {
        queryClient.setQueryData(['userPosts', user?.id], [optimisticPost, ...previousUserPosts]);
      }

      // Optimistically update user profile
      if (user?.username && previousUserProfile) {
        queryClient.setQueryData(['user', user.username], {
          ...previousUserProfile,
          posts: [optimisticPost, ...(previousUserProfile.posts || [])]
        });
      }

      // Return a context object with the snapshotted value
      return {
        previousPosts,
        previousUserPosts,
        previousUserProfile,
        optimisticPost
      };
    },
    onError: (err, newPostData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
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
    onSuccess: async (newPost, variables, context) => {
      // Replace the optimistic post with the real one
      const realPost = newPost;

      // Update posts list with real data
      queryClient.setQueryData(['posts'], (oldPosts) => {
        if (!Array.isArray(oldPosts)) return oldPosts;
        return oldPosts.map(post =>
          post.id === context?.optimisticPost?.id ? realPost : post
        );
      });

      // Update user posts with real data
      queryClient.setQueryData(['userPosts', user?.id], (oldPosts) => {
        if (!Array.isArray(oldPosts)) return oldPosts;
        return oldPosts.map(post =>
          post.id === context?.optimisticPost?.id ? realPost : post
        );
      });

      // Update user profile with real data
      if (user?.username) {
        queryClient.setQueryData(['user', user.username], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            posts: oldData.posts?.map(post =>
              post.id === context?.optimisticPost?.id ? realPost : post
            ) || []
          };
        });
      }

      // Cache the new post individually for immediate access
      if (realPost.slug) {
        queryClient.setQueryData(['post', realPost.slug], realPost);
      }

      // Navigate to the new post using real slug
      if (realPost.slug) {
        navigate(`/post/${realPost.slug}`);
      } else {
        navigate('/dashboard');
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts', user?.id] });
      if (user?.username) {
        queryClient.invalidateQueries({ queryKey: ['user', user.username] });
      }
    },
  });

  const handleCreatePost = (postData) => {
    setError('');

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