import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RootRedirect() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/landing" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  return <Navigate to="/dashboard" replace />;
}
