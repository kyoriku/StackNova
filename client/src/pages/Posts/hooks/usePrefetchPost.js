// Updated usePrefetchPost.js
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const usePrefetchPost = () => {
  const queryClient = useQueryClient();

  return useCallback((postSlug) => { // Renamed from postId to postSlug for clarity
    // Skip prefetching if the user has data-saving mode enabled
    if (navigator.connection && navigator.connection.saveData) return;
    // Skip if no postSlug (shouldn't happen, but just in case)
    if (!postSlug) return;
    // Skip if the postSlug is already in the cache
    if (queryClient.getQueryData(['post', postSlug.toString()])) return;

    let timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      queryClient.prefetchQuery({
        queryKey: ['post', postSlug.toString()],
        queryFn: async () => {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postSlug}`);
            if (!response.ok) {
              // We can be less aggressive with error handling for prefetch
              console.warn(`Failed to prefetch post ${postSlug}: ${response.status}`);
              return null;
            }
            return response.json();
          } catch (error) {
            // Log but don't throw for prefetch errors
            console.warn(`Error prefetching post ${postSlug}:`, error);
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