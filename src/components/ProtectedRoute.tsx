import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const location = useLocation();
  const { user, loading } = useAuthStore();

  // ⏳ Wait until auth check completes
  if (loading) {
    return null;
  }

  // 🔐 Redirect if not logged in
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