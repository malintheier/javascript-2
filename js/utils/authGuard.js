import { getFromLocalStorage } from "./storage.js";

export function isAuthenticated() {
  const token = getFromLocalStorage("accessToken");
  return Boolean(token);
}

export function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

requireAuth();
