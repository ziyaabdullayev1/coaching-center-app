import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="p-8">Checking session...</p>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
