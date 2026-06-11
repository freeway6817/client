// client/src/api/resolveUrl.js

/** Single source of truth for the server base URL — same env var as axios.js */
export const SERVER_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

/**
 * Turns a server-relative path like "/uploads/abc.jpg" into a full URL.
 * Already-absolute URLs are passed through unchanged.
 */
export const resolveMediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SERVER_BASE}${path}`;
};
