import { Suspense } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import UserProfile from '../pages/UserProfile';
import LoadingSpinner from './LoadingSpinner';
import { ErrorBoundary } from './ErrorBoundary';

const UserProfileWrapper = () => {
  const queryClient = useQueryClient();
  const { username } = useParams();
  
  // Check if we have prefetched data using the same query key as the profile page
  const prefetchedData = queryClient.getQueryData(['user', username]);
  
  // Only wrap in Suspense if we don't have prefetched data
  if (prefetchedData) {
    return (
      <ErrorBoundary>
        <UserProfile />
      </ErrorBoundary>
    );
  }
  
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner text="Loading profile..." />}>
        <UserProfile />
      </Suspense>
    </ErrorBoundary>
  );
};

export default UserProfileWrapper;