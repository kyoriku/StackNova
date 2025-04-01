import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const usePrefetchPosts = () => {
  const queryClient = useQueryClient();

  return useCallback(() => {
    // Skip prefetching if the user has data-saving mode enabled
    if (navigator.connection && navigator.connection.saveData) return;
    // Skip if the posts are already in the cache
    if (queryClient.getQueryData(['posts'])) return;

    let timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      queryClient.prefetchQuery({
        queryKey: ['posts'],
        queryFn: async () => {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`);
            if (!response.ok) {
              console.warn(`Failed to prefetch posts: ${response.status}`);
              return null;
            }
            return response.json();
          } catch (error) {
            console.warn('Error prefetching posts:', error);
            return null;
          }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 30  // 30 minutes
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [queryClient]);
};