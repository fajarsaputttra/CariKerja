import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-500">
        Memeriksa sesi login...
      </div>
    );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}