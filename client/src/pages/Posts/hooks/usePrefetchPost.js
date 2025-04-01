import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const usePrefetchPost = () => {
  const queryClient = useQueryClient();

  return useCallback((postId) => {
    // Skip prefetching if the user has data-saving mode enabled
    if (navigator.connection && navigator.connection.saveData) return;
    // Skip if no postId (shouldn't happen, but just in case)
    if (!postId) return;
    // Skip if the postId is already in the cache
    if (queryClient.getQueryData(['post', postId.toString()])) return;

    let timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      queryClient.prefetchQuery({
        queryKey: ['post', postId.toString()],
        queryFn: async () => {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`);
            if (!response.ok) {
              // We can be less aggressive with error handling for prefetch
              console.warn(`Failed to prefetch post ${postId}: ${response.status}`);
              return null;
            }
            return response.json();
          } catch (error) {
            // Log but don't throw for prefetch errors
            console.warn(`Error prefetching post ${postId}:`, error);
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