import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const location = useLocation();
  const { user, loading } = useAuthStore();

  // ⏳ Wait for auth check
  if (loading) {
    return null;
  }

  // 🔐 Block if not logged in
  if (!user) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return <>{children}</>;
}