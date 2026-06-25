import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RootRedirect from "./components/RootRedirect";
import { Toaster } from "react-hot-toast";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MoodTracker from "./pages/MoodTracker";
import Goals from "./pages/Goals";
import Journal from "./pages/Journal";
import Resources from "./pages/Resources";
import Bookmarks from "./pages/Bookmarks";
import Progress from "./pages/Progress";
import Mindfulness from "./pages/Mindfulness";

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireStudent={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mood"
          element={
            <ProtectedRoute requireStudent={true}>
              <MoodTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <ProtectedRoute requireStudent={true}>
              <Goals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journal"
          element={
            <ProtectedRoute requireStudent={true}>
              <Journal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute requireStudent={true}>
              <Resources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute requireStudent={true}>
              <Bookmarks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute requireStudent={true}>
              <Progress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mindfulness"
          element={
            <ProtectedRoute requireStudent={true}>
              <Mindfulness />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
