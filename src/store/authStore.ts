import { create } from "zustand";

interface AuthState {
  user: any | null;
  loading: boolean;

  setUser: (user: any) => void;
  setAuth: (token: string, user: any) => void;
  fetchMe: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,

  // ----------------------------
  // Set only user
  // ----------------------------
  setUser: (user) => set({ user }),

  // ----------------------------
  // 🔥 SET AUTH (CRITICAL FOR LOGIN/SIGNUP)
  // ----------------------------
  setAuth: (token, user) => {
    localStorage.setItem("token", token);

    set({
      user,
      loading: false,
    });
  },

  // ----------------------------
  // Fetch Current User
  // ----------------------------
  fetchMe: async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      // 🔥 CRITICAL FIX
      set({
        user: null,
        loading: false,
      });
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

    if (!res.ok) {
      // 🔥 CRITICAL FIX
      set({
        user: null,
        loading: false,
      });
      return;
    }

    const data = await res.json();

    set({
      user: data.user,
      loading: false,
    });
  } catch (err) {
    // 🔥 CRITICAL FIX
    set({
      user: null,
      loading: false,
    });
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