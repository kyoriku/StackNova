import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';

export const usePosts = (searchTerm) => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Posts not found');
          }
          if (response.status === 401) {
            throw new Error('Unauthorized access');
          }
          throw new Error(`Server error: ${response.status}`);
        }
        return response.json();
      } catch (error) {
        if (error instanceof TypeError) {
          throw new Error('Network error - please check your connection');
        }
        throw error;
      }
    },
    // Caching configuration
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    cacheTime: 1000 * 60 * 30, // Keep data in cache for 30 minutes
  });

  const filteredPosts = posts?.filter(post => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const postDate = format(parseISO(post.createdAt), 'MMMM yyyy').toLowerCase();

    const matchesPost =
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.user.username.toLowerCase().includes(searchLower) ||
      postDate.includes(searchLower);

    const matchesComments = post.comments?.some(comment =>
      comment.comment_text.toLowerCase().includes(searchLower) ||
      comment.user.username.toLowerCase().includes(searchLower)
    ) || false;

    return matchesPost || matchesComments;
  }) || [];

  return { posts: filteredPosts, isLoading, error };
};