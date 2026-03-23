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

      // No token → guest mode
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5003/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Backend reachable but user not authenticated
      if (!res.ok) {
        setUser(null);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setUser(data);

    } catch (err) {
      // Backend unreachable / server restarting
      console.warn("Auth server unreachable. Running in guest mode.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
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