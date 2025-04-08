import { useParams } from 'react-router-dom';
import { useUserProfile } from './hooks/useUserProfile';
import { usePrefetchPost } from '../../pages/Posts/hooks/usePrefetchPost';
import { UserStats } from './components/UserStats';
import { UserPosts } from './components/UserPosts';
import { UserComments } from './components/UserComments';
import { format } from 'date-fns';
import NotFound from '../NotFound';
import { UserMetaTags } from './components/MetaTags';
import { useQueryClient } from '@tanstack/react-query';

const UserProfile = () => {
  const { username } = useParams();
  const queryClient = useQueryClient();

  // Check if we have prefetched data
  const prefetchedData = queryClient.getQueryData(['user', username]);

  // Use suspense mode only if we don't have prefetched data
  const { data: user, error, isError } = useUserProfile(username, {
    suspense: !prefetchedData
  });

  const prefetchPost = usePrefetchPost();

  // Show NotFound component if user doesn't exist
  if (isError || !user) {
    return (
      <NotFound
        title="User not found"
        message={`The user "${username}" does not exist or could not be found.`}
      />
    );
  }

  const userStats = {
    totalPosts: user.posts?.length || 0,
    totalComments: user.comments?.length || 0,
    memberSince: user.createdAt
      ? format(new Date(user.createdAt), 'MMMM yyyy')
      : 'Unknown'
  };

  return (
    <div className="max-w-5xl mx-auto pb-8">
      {user && <UserMetaTags username={user.username} />}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {user.username}'s Profile
        </h1>
      </header>

      <UserStats stats={userStats} />
      <UserPosts posts={user.posts || []} prefetchPost={prefetchPost} />
      <UserComments comments={user.comments || []} prefetchPost={prefetchPost} />
    </div>
  );
};

export default UserProfile;