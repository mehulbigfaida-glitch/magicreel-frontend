import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return <>{children}</>;
}