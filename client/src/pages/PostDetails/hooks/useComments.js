import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export const useComments = (postSlug) => {
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const addCommentMutation = useMutation({
    mutationFn: async (newComment) => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error('Failed to add comment');
        error.response = { data: errorData };
        throw error;
      }
      
      return response.json();
    },
    onSuccess: async () => {
      // Force immediate cache removal for current user to show loading
      if (user?.username) {
        queryClient.removeQueries({ queryKey: ['user', user.username] });
      }

      // Then invalidate other caches
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({ queryKey: ['post', postSlug] }),
        queryClient.invalidateQueries({
          queryKey: ['user'],
          exact: false,
          refetchType: 'active'
        })
      ]);
    }
  });

  const editCommentMutation = useMutation({
    mutationFn: async ({ commentId, updatedText }) => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_text: updatedText }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error('Failed to edit comment');
        error.response = { data: errorData };
        throw error;
      }
      
      return response.json();
    },
    onSuccess: async () => {
      // Force immediate cache removal for current user
      if (user?.username) {
        queryClient.removeQueries({ queryKey: ['user', user.username] });
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({ queryKey: ['post', postSlug] }),
        queryClient.invalidateQueries({
          queryKey: ['user'],
          exact: false,
          refetchType: 'active'
        })
      ]);

      setEditingCommentId(null);
    }
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error('Failed to delete comment');
        error.response = { data: errorData };
        throw error;
      }
    },
    onSuccess: async () => {
      // Force immediate cache removal for current user
      if (user?.username) {
        queryClient.removeQueries({ queryKey: ['user', user.username] });
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({ queryKey: ['post', postSlug] }),
        queryClient.invalidateQueries({
          queryKey: ['user'],
          exact: false,
          refetchType: 'active'
        })
      ]);

      setDeleteModalOpen(false);
      setCommentToDelete(null);
    }
  });

  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id);
    setTimeout(() => {
      document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDeleteClick = (comment) => {
    setCommentToDelete(comment);
    setDeleteModalOpen(true);
  };

  return {
    editingCommentId,
    setEditingCommentId,
    deleteModalOpen,
    setDeleteModalOpen,
    commentToDelete,
    addCommentMutation,
    editCommentMutation,
    deleteCommentMutation,
    handleEditClick,
    handleDeleteClick
  };
};