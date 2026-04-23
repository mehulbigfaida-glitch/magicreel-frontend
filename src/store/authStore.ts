import { create } from "zustand";

interface AuthState {
  user: any | null;
  loading: boolean;

  setUser: (user: any) => void;
  fetchMe: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  fetchMe: async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        set({ user: null, loading: false });
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        set({ user: data.user, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    } catch {
      set({ user: null, loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
}));