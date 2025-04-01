import { Suspense } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Dashboard from '../pages/Dashboard';
import LoadingSpinner from './LoadingSpinner';
import { ErrorBoundary } from './ErrorBoundary';
import { useAuth } from '../context/AuthContext';

const DashboardWrapper = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Check if we have prefetched data using the same query key as useDashboardPosts
  const prefetchedData = queryClient.getQueryData(['userPosts', user?.id]);
  
  // Only wrap in Suspense if we don't have prefetched data
  if (prefetchedData) {
    return (
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    );
  }
  
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner text="Loading dashboard..." />}>
        <Dashboard />
      </Suspense>
    </ErrorBoundary>
  );
};

export default DashboardWrapper;