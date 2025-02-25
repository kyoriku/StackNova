import { useQuery } from '@tanstack/react-query';

export const useUserProfile = (username) => {
  return useQuery({
    queryKey: ['user', username],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/profile/${username}`);
      if (!response.ok) throw new Error('Failed to fetch user profile');
      return response.json();
    }
  });
};