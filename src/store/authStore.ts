import { create } from "zustand";
import { API_BASE } from "../config/api";

interface AuthState {
  user: any | null;
  loading: boolean;

  setUser: (user: any) => void;
  setAuth: (token: string, user: any) => void;
  fetchMe: () => Promise<void>;
  refreshCredits: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,

  // ----------------------------
  // Set only user
  // ----------------------------
  setUser: (user) => set({ user }),

  // ----------------------------
  // 🔥 SET AUTH
  // ----------------------------
  setAuth: (token, user) => {
    localStorage.setItem("token", token);

    set({
      user,
      loading: false,
    });
  },

  // ----------------------------
  // Fetch Current User (FULL LOAD)
  // ----------------------------
  fetchMe: async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        set({ user: null, loading: false });
        return;
      }

      set({ loading: true });

      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        set({ user: null, loading: false });
        return;
      }

      const data = await res.json();

      // ✅ SAFE SET
      set({
        user: data.user || null,
        loading: false,
      });

    } catch (err) {
      set({
        user: null,
        loading: false,
      });
    }
  },

  // ----------------------------
  // 🔄 REFRESH CREDITS (SAFE MERGE)
  // ----------------------------
  refreshCredits: async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      const data = await res.json();

      const currentUser = get().user;

      // ✅ MERGE instead of overwrite
      set({
        user: {
          ...currentUser,
          ...data.user,
        },
      });

    } catch (err) {
      console.error("refreshCredits error:", err);
    }
  },

  // ----------------------------
  // Logout
  // ----------------------------
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
}));