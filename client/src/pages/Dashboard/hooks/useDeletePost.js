import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContext';

export const useDeletePost = ({ userId, onSuccess }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const deletePostMutation = useMutation({
    mutationFn: async (postSlugOrId) => {
      // The backend controller handles both slug and ID
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postSlugOrId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to delete post');
    },
    onSuccess: async (_, postSlugOrId) => {
      // Remove individual post from cache
      queryClient.removeQueries({
        queryKey: ['post', postSlugOrId],
        exact: true
      });

      // Optimistically update dashboard posts
      const currentPosts = queryClient.getQueryData(['userPosts', userId]) || [];
      if (Array.isArray(currentPosts)) {
        const updatedPosts = currentPosts.filter(post =>
          post.slug !== postSlugOrId && post.id !== postSlugOrId
        );
        queryClient.setQueryData(['userPosts', userId], updatedPosts);
      }

      // Optimistically update user profile cache if we have the username
      if (user?.username) {
        queryClient.setQueryData(['user', user.username], (oldData) => {
          if (!oldData || !oldData.posts) return oldData;

          return {
            ...oldData,
            posts: oldData.posts.filter(post =>
              post.slug !== postSlugOrId && post.id !== postSlugOrId
            )
          };
        });
      }

      // Optimistically update general posts list
      const allPosts = queryClient.getQueryData(['posts']) || [];
      if (Array.isArray(allPosts)) {
        const updatedAllPosts = allPosts.filter(post =>
          post.slug !== postSlugOrId && post.id !== postSlugOrId
        );
        queryClient.setQueryData(['posts'], updatedAllPosts);
      }

      // Invalidate relevant queries with proper patterns
      await Promise.all([
        // Invalidate all user profile queries
        queryClient.invalidateQueries({
          queryKey: ['user'],
          exact: false
        }),
        // Invalidate general posts list
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        // Specifically invalidate the current user's profile if we have the username
        ...(user?.username ? [
          queryClient.invalidateQueries({ queryKey: ['user', user.username] })
        ] : [])
      ]);

      if (onSuccess) {
        onSuccess();
      }
    }
  });

  return { deletePostMutation };
};

// ----------------------------------------------------------------------------

// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { useAuth } from '../../../context/AuthContext';

// export const useDeletePost = ({ userId, onSuccess }) => {
//   const queryClient = useQueryClient();
//   const { user } = useAuth();

//   const deletePostMutation = useMutation({
//     mutationFn: async (postSlugOrId) => {
//       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postSlugOrId}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include'
//       });
//       if (!response.ok) throw new Error('Failed to delete post');
//     },
//     onMutate: async (postSlugOrId) => {
//       // Cancel any outgoing refetches
//       await queryClient.cancelQueries({ queryKey: ['posts'] });
//       await queryClient.cancelQueries({ queryKey: ['userPosts', userId] });
//       if (user?.username) {
//         await queryClient.cancelQueries({ queryKey: ['user', user.username] });
//       }

//       // Snapshot the previous values
//       const previousPosts = queryClient.getQueryData(['posts']);
//       const previousUserPosts = queryClient.getQueryData(['userPosts', userId]);
//       const previousUserProfile = user?.username ? queryClient.getQueryData(['user', user.username]) : null;

//       // Find the post being deleted to store it for potential rollback
//       const deletedPost = Array.isArray(previousPosts)
//         ? previousPosts.find(post => post.slug === postSlugOrId || post.id === postSlugOrId)
//         : null;

//       // Optimistically remove from posts list
//       if (Array.isArray(previousPosts)) {
//         const updatedPosts = previousPosts.filter(post =>
//           post.slug !== postSlugOrId && post.id !== postSlugOrId
//         );
//         queryClient.setQueryData(['posts'], updatedPosts);
//       }

//       // Optimistically remove from user posts
//       if (Array.isArray(previousUserPosts)) {
//         const updatedUserPosts = previousUserPosts.filter(post =>
//           post.slug !== postSlugOrId && post.id !== postSlugOrId
//         );
//         queryClient.setQueryData(['userPosts', userId], updatedUserPosts);
//       }

//       // Optimistically remove from user profile
//       if (user?.username && previousUserProfile) {
//         queryClient.setQueryData(['user', user.username], {
//           ...previousUserProfile,
//           posts: previousUserProfile.posts?.filter(post =>
//             post.slug !== postSlugOrId && post.id !== postSlugOrId
//           ) || []
//         });
//       }

//       // Remove individual post from cache
//       queryClient.removeQueries({
//         queryKey: ['post', postSlugOrId],
//         exact: true
//       });

//       return {
//         previousPosts,
//         previousUserPosts,
//         previousUserProfile,
//         deletedPost,
//         postSlugOrId
//       };
//     },
//     onError: (err, postSlugOrId, context) => {
//       // Rollback on error
//       if (context?.previousPosts) {
//         queryClient.setQueryData(['posts'], context.previousPosts);
//       }
//       if (context?.previousUserPosts) {
//         queryClient.setQueryData(['userPosts', userId], context.previousUserPosts);
//       }
//       if (context?.previousUserProfile && user?.username) {
//         queryClient.setQueryData(['user', user.username], context.previousUserProfile);
//       }

//       // Restore the individual post cache if we have the deleted post data
//       if (context?.deletedPost && context?.postSlugOrId) {
//         queryClient.setQueryData(['post', context.postSlugOrId], context.deletedPost);
//       }
//     },
//     onSuccess: async (_, postSlugOrId) => {
//       // The optimistic update already happened, just call the success callback
//       if (onSuccess) {
//         onSuccess();
//       }
//     },
//     onSettled: () => {
//       // Refetch to ensure consistency
//       queryClient.invalidateQueries({ queryKey: ['posts'] });
//       queryClient.invalidateQueries({ queryKey: ['userPosts', userId] });
//       if (user?.username) {
//         queryClient.invalidateQueries({ queryKey: ['user', user.username] });
//       }
//     }
//   });

//   return { deletePostMutation };
// };