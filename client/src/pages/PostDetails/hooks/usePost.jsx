import { useQuery } from '@tanstack/react-query';

export const usePost = (id) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${id}`);
      if (!response.ok) throw new Error('Failed to fetch post');
      return response.json();
    }
  });
};