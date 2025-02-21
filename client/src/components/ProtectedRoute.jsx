import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;