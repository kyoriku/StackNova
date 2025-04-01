import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContext'; // Adjust path as needed

export const usePrefetchDashboard = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Get current user to include in query key

  return useCallback(() => {
    // Skip prefetching if the user has data-saving mode enabled
    if (navigator.connection && navigator.connection.saveData) return;
    // Skip if no user (shouldn't happen since this is used in authenticated context, but just in case)
    if (!user?.id) return;
    // Skip if dashboard data is already in cache
    if (queryClient.getQueryData(['userPosts', user.id])) return;

    let timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      queryClient.prefetchQuery({
        queryKey: ['userPosts', user.id], // Match the exact query key from useDashboardPosts
        queryFn: async () => {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/user/posts`);
            if (!response.ok) {
              // Less aggressive error handling for prefetch
              console.warn(`Failed to prefetch dashboard posts: ${response.status}`);
              return null;
            }
            return response.json();
          } catch (error) {
            // Log but don't throw for prefetch errors
            console.warn('Error prefetching dashboard posts:', error);
            return null;
          }
        },
        staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
        cacheTime: 1000 * 60 * 30 // Cache for 30 minutes
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [queryClient, user?.id]); // Include user.id in dependencies
};