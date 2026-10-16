import { io } from "socket.io-client";

/**
 * Resolve Socket URL safely across development and production environments.
 * Prevents production deployments (e.g., https://www.wellwigen.com) from attempting
 * to connect to loopback http://localhost:8000, which triggers browser PNA/CORS blocks.
 */
export const getSocketUrl = () => {
  // 1. Explicit socket URL override
  const customSocketUrl = import.meta.env.VITE_SOCKET_URL;
  if (customSocketUrl) return customSocketUrl;

  // 2. Base API URL (e.g. https://api.wellwigen.com)
  const apiBase = import.meta.env.VITE_API_BASE_URL;
  if (apiBase && !apiBase.includes("localhost")) return apiBase;

  // 3. Full API URL (strip trailing /api)
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl && !apiUrl.includes("localhost")) {
    return apiUrl.replace(/\/api\/?$/, "");
  }

  // 4. Production guard: In browser on HTTPS / non-localhost domains,
  // do NOT attempt to connect to loopback localhost.
  if (typeof window !== "undefined") {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "0.0.0.0";

    if (!isLocalhost) {
      // In production without an explicit remote backend URL, disable socket connection
      return null;
    }
  }

  // 5. Localhost development fallback
  return apiBase || (apiUrl ? apiUrl.replace(/\/api\/?$/, "") : "http://localhost:8000");
};

const SOCKET_URL = getSocketUrl();

const socket = SOCKET_URL
  ? io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      timeout: 10000,
    })
  : io({
      autoConnect: false, // Prevents browser from attempting loopback connection from public origin
    });

export default socket;