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

  // Not logged in at all
  if (!user) {
    return <Navigate to="/landing" replace />;
  }

  const isAdmin = user.email === "admin@unimasmhwb.com";

  // If page requires Admin, but user is a Student
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // If page requires Student, but user is an Admin
  if (requireStudent && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
