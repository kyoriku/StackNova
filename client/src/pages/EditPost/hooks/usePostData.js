import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContext';

export const usePostData = (postId) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState('');

  // Fetch existing post
  const { data: post, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`);
      if (!response.ok) throw new Error('Failed to fetch post');
      return response.json();
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  // Verify post ownership
  useEffect(() => {
    if (post && user && post.user_id !== user.id) {
      navigate('/dashboard');
    }
  }, [post, user, navigate]);

  return {
    post,
    isLoading,
    error
  };
};