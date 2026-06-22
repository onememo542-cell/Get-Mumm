import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl } from "@/api";

// Configure the API base URL from the environment variable.
// VITE_API_URL must be set in the environment variables. Without this, API calls resolve to relative
// paths (e.g. /api/...) which may return errors if no backend is configured at that location.
const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
if (apiUrl) {
  setBaseUrl(apiUrl);
  console.log("[API] Base URL configured:", apiUrl);
}

createRoot(document.getElementById("root")!).render(<App />);

// Service worker causes message port errors in some environments
// Only register if explicitly enabled
const enableServiceWorker = import.meta.env.VITE_ENABLE_SW === "true";

if (enableServiceWorker && "serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`.replace(/\/\//g, "/");
    navigator.serviceWorker.register(swUrl)
      .then((reg) => console.log("[SW] Registered:", swUrl))
      .catch((err) => console.warn("[SW] Failed to register:", err));
  });
}
