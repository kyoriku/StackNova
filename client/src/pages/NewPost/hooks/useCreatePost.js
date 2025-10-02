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

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error('Failed to create post');
        
        if (errorData.errors && Array.isArray(errorData.errors)) {
          error.message = errorData.errors.map(err => err.msg).join('. ');
        } else if (errorData.message) {
          error.message = errorData.message;
        }
        
        error.response = { data: errorData };
        throw error;
      }

      return response.json();
    },
    onMutate: async (newPostData) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      await queryClient.cancelQueries({ queryKey: ['userPosts', user?.id] });
      if (user?.username) {
        await queryClient.cancelQueries({ queryKey: ['user', user.username] });
      }

      const previousPosts = queryClient.getQueryData(['posts']);
      const previousUserPosts = queryClient.getQueryData(['userPosts', user?.id]);
      const previousUserProfile = user?.username ? queryClient.getQueryData(['user', user.username]) : null;

      const optimisticPost = {
        id: `temp-${Date.now()}`,
        title: newPostData.title,
        content: newPostData.content,
        excerpt: newPostData.content.substring(0, 150) + '...',
        slug: `temp-slug-${Date.now()}`,
        user_id: user?.id,
        username: user?.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          username: user?.username
        },
        comments: []
      };

      if (Array.isArray(previousPosts)) {
        queryClient.setQueryData(['posts'], [optimisticPost, ...previousPosts]);
      }

      if (Array.isArray(previousUserPosts)) {
        queryClient.setQueryData(['userPosts', user?.id], [optimisticPost, ...previousUserPosts]);
      }

      if (user?.username && previousUserProfile) {
        queryClient.setQueryData(['user', user.username], {
          ...previousUserProfile,
          posts: [optimisticPost, ...(previousUserProfile.posts || [])]
        });
      }

      return {
        previousPosts,
        previousUserPosts,
        previousUserProfile,
        optimisticPost
      };
    },
    onError: (err, newPostData, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      if (context?.previousUserPosts) {
        queryClient.setQueryData(['userPosts', user?.id], context.previousUserPosts);
      }
      if (context?.previousUserProfile && user?.username) {
        queryClient.setQueryData(['user', user.username], context.previousUserProfile);
      }

      setError(err.message || 'Failed to create post. Please try again.');
    },
    onSuccess: async (newPost, variables, context) => {
      const realPost = newPost;

      queryClient.setQueryData(['posts'], (oldPosts) => {
        if (!Array.isArray(oldPosts)) return oldPosts;
        return oldPosts.map(post =>
          post.id === context?.optimisticPost?.id ? realPost : post
        );
      });

      queryClient.setQueryData(['userPosts', user?.id], (oldPosts) => {
        if (!Array.isArray(oldPosts)) return oldPosts;
        return oldPosts.map(post =>
          post.id === context?.optimisticPost?.id ? realPost : post
        );
      });

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

      if (realPost.slug) {
        queryClient.setQueryData(['post', realPost.slug], realPost);
      }

      if (realPost.slug) {
        navigate(`/post/${realPost.slug}`);
      } else {
        navigate('/dashboard');
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts', user?.id] });
      if (user?.username) {
        queryClient.invalidateQueries({ queryKey: ['user', user.username] });
      }
    },
  });

  const handleCreatePost = (postData) => {
    setError('');

    // Client-side validation
    if (!postData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (postData.title.length > POST_LIMITS.TITLE_MAX) {
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

    if (postData.content.length > POST_LIMITS.CONTENT_MAX) {
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