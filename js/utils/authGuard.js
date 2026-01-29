import { getFromLocalStorage } from "./storage.js";

export function isAuthenticated() {
  try {
    const token = getFromLocalStorage("accessToken");
    return Boolean(token);
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return false;
  }
}

export function requireAuth() {
  try {
    if (!isAuthenticated()) {
      alert("You must be logged in to access this page. Redirecting to login...");
      window.location.href = "login.html";
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error during authentication check:", error);
    alert("Unable to verify authentication. Redirecting to login...");
    window.location.href = "login.html";
    return false;
  }
}

requireAuth();
