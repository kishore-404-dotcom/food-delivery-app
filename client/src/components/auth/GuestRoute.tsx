import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function GuestRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-12">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"
          role="status"
          aria-label="Verifying session"
        />
        <p className="mt-4 font-medium text-gray-600">Verifying session...</p>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

export default GuestRoute;
