import { ErrorBoundary } from './ErrorBoundary';
import UserProfile from '../pages/UserProfile';

const UserProfileWrapper = () => {
  // We're handling all loading and error states in the UserProfile component
  return (
    <ErrorBoundary>
      <UserProfile />
    </ErrorBoundary>
  );
};

export default UserProfileWrapper;