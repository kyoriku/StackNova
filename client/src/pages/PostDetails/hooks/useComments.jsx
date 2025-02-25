import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export const useComments = (postId) => {
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const queryClient = useQueryClient();

  const addCommentMutation = useMutation({
    mutationFn: async (newComment) => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment)
      });
      if (!response.ok) throw new Error('Failed to add comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    }
  });

  const editCommentMutation = useMutation({
    mutationFn: async ({ commentId, updatedText }) => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_text: updatedText })
      });
      if (!response.ok) throw new Error('Failed to edit comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      setEditingCommentId(null);
    }
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete comment');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
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