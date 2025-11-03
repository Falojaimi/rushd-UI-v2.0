// /var/www/rushd/utils/session.ts
export function getSessionId() {
  if (typeof window === "undefined") return ""; // SSR guard
  const key = "rushd_session_id";
  let v = localStorage.getItem(key);
  if (!v) {
    v = crypto.randomUUID();
    localStorage.setItem(key, v);
  }
  return v;
}