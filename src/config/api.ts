const signupPreviewHost =
  typeof window !== "undefined" &&
  window.location.hostname.startsWith("magicreel-frontend-git-feature-em-") &&
  window.location.hostname.endsWith(".vercel.app");

export const API_BASE = signupPreviewHost
  ? "https://magicreel-instagram-backend-staging-staging.up.railway.app"
  : import.meta.env.VITE_API_BASE ||
    import.meta.env.VITE_API_BASE_URL ||
    "https://magicreel-backend-production.up.railway.app";
