import Cookies from "js-cookie";

export function getAuthUser() {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("access_token");
  const userRaw = localStorage.getItem("user");

  if (!token || !userRaw) return null;

  try {
    return JSON.parse(userRaw);
  } catch {
    return null;
  }
}

export function logoutLocal() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  Cookies.remove("access_token");
  Cookies.remove("user_role");
}
