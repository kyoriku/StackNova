import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = () => {
  const { isLoading, isAuthenticated, isAuthStatusResolved } = useAuth();
  const location = useLocation();

  if (isLoading || !isAuthStatusResolved) {
    return <LoadingSpinner text="Verifying access..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;