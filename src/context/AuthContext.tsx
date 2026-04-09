// FILE: src/context/AuthContext.tsx (FULL REPLACEMENT)

import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  plan: "FREE" | "BASIC" | "PRO" | "ADVANCE" | "ENTERPRISE";
  creditsAvailable: number;
  freeHeroUsed: boolean;
  subscriptionType?: "MONTHLY" | "ANNUAL";
  subscriptionEnd?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        setUser(null);
        setLoading(false);
        return;
      }

      const data = await res.json();

      setUser({
        ...data,
        creditsAvailable: data.creditsAvailable ?? 0,
      });
    } catch (err) {
      console.warn("Auth server unreachable. Running in guest mode.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    // 🔥 LISTEN FOR CREDIT UPDATE EVENTS
    const handler = () => {
      fetchUser();
    };

    window.addEventListener("creditsUpdated", handler);

    return () => {
      window.removeEventListener("creditsUpdated", handler);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}