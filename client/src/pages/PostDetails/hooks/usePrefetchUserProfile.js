import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const usePrefetchUserProfile = () => {
  const queryClient = useQueryClient();

  return useCallback((username) => {
    // Skip prefetching if the user has data-saving mode enabled
    if (navigator.connection && navigator.connection.saveData) return;
    // Skip if no username (shouldn't happen, but just in case)
    if (!username) return; 
    // Skip if the username is already in the cache
    if (queryClient.getQueryData(['user', username])) return;

    let timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      queryClient.prefetchQuery({
        queryKey: ['user', username.toString()],
        queryFn: async () => {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/profile/${username}`);
            if (!response.ok) {
              // We can be less aggressive with error handling for prefetch
              console.warn(`Failed to prefetch user ${username}: ${response.status}`);
              return null;
            }
            return response.json();
          } catch (error) {
            // Log but don't throw for prefetch errors
            console.warn(`Error prefetching user ${username}:`, error);
            return null;
          }
        },
        staleTime: 1000 * 60 * 5, 
        cacheTime: 1000 * 60 * 30
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [queryClient]);
};