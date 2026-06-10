import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  requireAdmin,
  requireStudent,
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-navy font-bold">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/landing" replace />;
  }

  const isAdmin = user.email === "admin@unimasmhwb.com";

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireStudent && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
