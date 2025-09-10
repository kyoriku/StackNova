import { useQuery } from '@tanstack/react-query';

export const usePost = (identifier) => {
  return useQuery({
    queryKey: ['post', identifier],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${identifier}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch post');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30
  });
};

// ----------------------------------------------------------------------------

// import { useQuery } from '@tanstack/react-query';

// export const usePost = (id) => {
//   return useQuery({
//     queryKey: ['post', id],
//     queryFn: async () => {
//       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${id}`);
//       if (!response.ok) throw new Error('Failed to fetch post');
//       return response.json();
//     },
//     // Caching configuration
//     staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minute
//     cacheTime: 1000 * 60 * 30 // Keep data in cache for 30 minutes
//   });
// };

// ----------------------------------------------------------------------------

// import { useQuery } from '@tanstack/react-query';

// export const usePost = (slug) => {
//   return useQuery({
//     queryKey: ['post', slug],
//     queryFn: async () => {
//       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${slug}`);
//       if (!response.ok) throw new Error('Failed to fetch post');
//       return response.json();
//     },
//     staleTime: 1000 * 60 * 5,
//     cacheTime: 1000 * 60 * 30
//   });
// };

