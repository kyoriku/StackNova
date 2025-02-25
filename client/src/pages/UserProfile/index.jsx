import { useParams } from 'react-router-dom';
import { useUserProfile } from './hooks/useUserProfile';
import { usePrefetchPost } from '../../pages/Posts/hooks/usePrefetchPost';
import { UserStats } from './components/UserStats';
import { UserPosts } from './components/UserPosts';
import { UserComments } from './components/UserComments';
import { format } from 'date-fns';
import LoadingSpinner from '../../components/LoadingSpinner';

const UserProfile = () => {
  const { username } = useParams();
  const { data: user, isLoading, error } = useUserProfile(username);
  const prefetchPost = usePrefetchPost();

  if (isLoading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center p-4 bg-red-100 dark:bg-red-500/10 rounded-lg">
        <h2 className="text-red-500 font-medium mb-1">Error loading profile</h2>
        <p className="text-sm text-red-500">{error.message}</p>
      </div>
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
    <div className="max-w-4xl mx-auto pb-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {user.username}'s Profile
        </h1>
        {/* <p className="text-center text-gray-600 dark:text-gray-400">
          {user.bio || `A code sharing enthusiast`}
        </p> */}
      </header>

      <UserStats stats={userStats} />
      <UserPosts posts={user.posts || []} prefetchPost={prefetchPost} />
      <UserComments comments={user.comments || []} prefetchPost={prefetchPost} />
    </div>
  );
};

export default UserProfile;