import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl } from "@/api";

// Configure the API base URL from the environment variable.
// VITE_API_URL must be set to the Vercel backend URL (e.g. https://get-mumm.vercel.app)
// in the Netlify environment variables. Without this, API calls resolve to relative
// paths on Netlify (e.g. /api/...) which return 404 HTML instead of JSON.
const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
if (apiUrl) {
  setBaseUrl(apiUrl);
}

createRoot(document.getElementById("root")!).render(<App />);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`.replace(/\/\//g, "/");
    navigator.serviceWorker.register(swUrl).catch(() => {});
  });
}
