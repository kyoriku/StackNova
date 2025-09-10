import { useParams } from 'react-router-dom';
import { useUserProfile } from './hooks/useUserProfile';
import { usePrefetchPost } from '../../pages/Posts/hooks/usePrefetchPost';
import { UserStats } from './components/UserStats';
import { UserPosts } from './components/UserPosts';
import { UserComments } from './components/UserComments';
import { format } from 'date-fns';
import NotFound from '../NotFound';
import { SEO } from '../../components/SEO';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '../../components/LoadingSpinner';

const UserProfile = () => {
  const { username } = useParams();
  const queryClient = useQueryClient();

  const prefetchedData = queryClient.getQueryData(['user', username]);

  const { data: user, error, isError, isLoading, status } = useUserProfile(username, {
    suspense: false,
    initialData: prefetchedData
  });

  const prefetchPost = usePrefetchPost();

  // Generate JSON-LD structured data for user profile
  const generateJsonLd = (user) => {
    if (!user) return null;

    return {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "mainEntity": {
        "@type": "Person",
        "name": user.username,
        "identifier": user.id,
        "description": `${user.username}'s profile on StackNova`,
        "url": `https://stacknova.ca/user/${user.username}`,
        "memberOf": {
          "@type": "Organization",
          "name": "StackNova"
        },
        "knowsAbout": ["programming", "technology", "development", "coding"],
        "publishedPosts": user.posts?.map(post => ({
          "@type": "BlogPosting",
          "headline": post.title,
          "url": `https://stacknova.ca/post/${post.slug}`
        })) || []
      }
    };
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  if (isError || (!isLoading && !user)) {
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

  const postTitles = user.posts?.map(post => post.title).join(', ') || '';
  const metaDescription = `${user.username}'s profile on StackNova. Member since ${userStats.memberSince}. ${userStats.totalPosts} posts and ${userStats.totalComments} comments.${postTitles ? ` Recent topics: ${postTitles.substring(0, 100)}${postTitles.length > 100 ? '...' : ''}` : ''}`;

  return (
    <div className="max-w-4xl mx-auto pb-8">
      <SEO
        title={`${user.username}'s Profile`}
        description={metaDescription}
        canonicalPath={`/user/${user.username}`}
        type="profile"
        noIndex={true}
        jsonLd={generateJsonLd(user)}
      />

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