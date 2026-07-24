import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

function CustomerRoute() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"
          role="status"
          aria-label="Verifying customer session"
        />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/register" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (user.role === "restaurant_owner") {
    return <Navigate to="/restaurant/dashboard" replace />;
  }

  return <Outlet />;
}

export default CustomerRoute;
