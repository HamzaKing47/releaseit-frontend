// Auto-detect backend URL: localhost in dev, production on deploy.
// Override with VITE_BACKEND_URL in .env if needed.
const isLocal =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

export const BACKEND =
  import.meta.env?.VITE_BACKEND_URL ||
  (isLocal ? "http://localhost:5000" : "https://api.ordernowcodform.xyz");
