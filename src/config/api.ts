export const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5003"
    : (import.meta.env.VITE_API_BASE_URL ||
       "https://magicreel-backend-production.up.railway.app");