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

export function loginLocal(token: string, user: any) {
  Cookies.set("access_token", token, { expires: 7 });
  Cookies.set("user_role", user.role, { expires: 7 });
  localStorage.setItem("access_token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function logoutLocal() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  Cookies.remove("access_token");
  Cookies.remove("user_role");
}
