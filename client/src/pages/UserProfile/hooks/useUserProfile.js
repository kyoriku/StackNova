import { useQuery } from '@tanstack/react-query';

export const useUserProfile = (username, options = {}) => {
  return useQuery({
    queryKey: ['user', username],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/profile/${username}`);
      if (!response.ok) throw new Error('Failed to fetch user profile');
      return response.json();
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 20, // Consider data fresh for 20 minutes
    cacheTime: 1000 * 60 * 60, // Cache for 60 minutes
    // Let the component that uses this hook control suspense mode
    suspense: options?.suspense ?? false
  });
};