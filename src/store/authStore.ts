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

      console.log("🔐 Token:", token);

      if (!token) {
        console.log("❌ No token found");
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

      console.log("📡 /me status:", res.status);

      const data = await res.json();

      console.log("👤 /me response:", data);

      // 🔥 STRICT SAFE SET
      if (res.ok && data?.user) {
        set({
          user: data.user,
          loading: false,
        });
      } else {
        console.log("❌ Invalid /me response");
        set({
          user: null,
          loading: false,
        });
      }
    } catch (err) {
      console.error("❌ fetchMe failed:", err);
      set({
        user: null,
        loading: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
}));