import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function ProtectedRoute() {
  const {
    isAuthenticated,
    loading
  } = useAuth();

  const location = useLocation();

  // Wait until AuthContext finishes checking the JWT
  if (loading) {
    return <div>Loading...</div>;
  }

  // User is not logged in
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // User is authenticated
  return <Outlet />;
}

export default ProtectedRoute;