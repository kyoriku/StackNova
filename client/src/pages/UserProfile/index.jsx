// import { useParams } from 'react-router-dom';
// import { useUserProfile } from './hooks/useUserProfile';
// import { usePrefetchPost } from '../../pages/Posts/hooks/usePrefetchPost';
// import { UserStats } from './components/UserStats';
// import { UserPosts } from './components/UserPosts';
// import { UserComments } from './components/UserComments';
// import { format } from 'date-fns';
// import LoadingSpinner from '../../components/LoadingSpinner';
// import NotFound from '../NotFound'; // Import your NotFound component
// import { Link } from 'react-router-dom';

// // Create a custom UserNotFound component based on NotFound
// const UserNotFound = ({ username }) => {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
//       <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
//         404
//       </h1>
//       <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
//         User "{username}" not found
//       </p>
//       <Link 
//         to="/"
//         className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
//       >
//         Return to Home
//       </Link>
//     </div>
//   );
// };

// const UserProfile = () => {
//   const { username } = useParams();
//   const { data: user, isLoading, error, isError } = useUserProfile(username);
//   const prefetchPost = usePrefetchPost();

//   if (isLoading) {
//     return <LoadingSpinner text="Loading profile..." />;
//   }

//   // Show custom UserNotFound component if user doesn't exist
//   if (isError || !user) {
//     return <NotFound message={`User "${username}" not found`} />;
//   }

//   const userStats = {
//     totalPosts: user.posts?.length || 0,
//     totalComments: user.comments?.length || 0,
//     memberSince: user.createdAt 
//       ? format(new Date(user.createdAt), 'MMMM yyyy')
//       : 'Unknown'
//   };

//   return (
//     <div className="max-w-4xl mx-auto pb-8">
//       <header className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//           {user.username}'s Profile
//         </h1>
//         {/* <p className="text-center text-gray-600 dark:text-gray-400">
//           {user.bio || `A code sharing enthusiast`}
//         </p> */}
//       </header>

//       <UserStats stats={userStats} />
//       <UserPosts posts={user.posts || []} prefetchPost={prefetchPost} />
//       <UserComments comments={user.comments || []} prefetchPost={prefetchPost} />
//     </div>
//   );
// };

// export default UserProfile;

import { useParams } from 'react-router-dom';
import { useUserProfile } from './hooks/useUserProfile';
import { usePrefetchPost } from '../../pages/Posts/hooks/usePrefetchPost';
import { UserStats } from './components/UserStats';
import { UserPosts } from './components/UserPosts';
import { UserComments } from './components/UserComments';
import { format } from 'date-fns';
import LoadingSpinner from '../../components/LoadingSpinner';
import NotFound from '../NotFound';
import { UserMetaTags } from './components/MetaTags';

const UserProfile = () => {
  const { username } = useParams();
  const { data: user, isLoading, error, isError } = useUserProfile(username);
  const prefetchPost = usePrefetchPost();

  if (isLoading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

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
    <div className="max-w-4xl mx-auto pb-8">
      {user && <UserMetaTags username={user.username} />}
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