// import { useQuery } from '@tanstack/react-query';

// export const useDashboardPosts = (userId) => {
//   return useQuery({
//     queryKey: ['userPosts', userId],
//     queryFn: async () => {
//       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/user/posts`);
//       if (!response.ok) throw new Error('Failed to fetch posts');
//       return response.json();
//     },
//     enabled: !!userId,
//     // Caching configuration
//     staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
//     cacheTime: 1000 * 60 * 30 // Cache for 30 minutes
//   });
// };

import { useQuery } from '@tanstack/react-query';

export const useDashboardPosts = (userId, options = {}) => {
  return useQuery({
    queryKey: ['userPosts', userId],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/user/posts`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    },
    enabled: !!userId,
    // Caching configuration
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    cacheTime: 1000 * 60 * 30, // Cache for 30 minutes
    // Let the component that uses this hook control suspense mode
    suspense: options?.suspense ?? false
  });
};