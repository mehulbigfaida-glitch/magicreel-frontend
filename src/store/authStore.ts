import { create } from "zustand";
import { API_BASE } from "../config/api";
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
  loading: true,

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
      set({ user: null, loading: false });
      return;
    }

    const res = await fetch(
      `${API_BASE}/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 🔥 IMPORTANT: handle non-JSON safely
    const text = await res.text();

    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      console.warn("⚠️ Non-JSON response from /me:", text);
      set({ user: null, loading: false });
      return;
    }

    if (res.ok && data?.user) {
      set({
        user: data.user,
        loading: false,
      });
    } else {
      set({
        user: null,
        loading: false,
      });
    }
  } catch (err) {
    console.error("fetchMe failed:", err);
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