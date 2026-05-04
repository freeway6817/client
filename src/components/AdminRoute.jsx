import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Changed to the new email
  if (!user || user.email !== "admin@unimasmhwb.com") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
