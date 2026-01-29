import { loginUser } from "../api/auth.js";
import { registerUser } from "../api/auth.js";

export function initLoginForm() {
  const loginForm = document.querySelector("#loginForm");

  async function onLoginFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formFields = Object.fromEntries(formData);

    if (!formFields.email || !formFields.password) {
      alert("Please enter both email and password to log in.");
      return;
    }

    try {
      const result = await loginUser(formFields);

      if (result && result.data) {
        window.location.href = "../pages/feed.html";
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert(
        error.message ||
          "Failed to log in. Please check your credentials and try again.",
      );
    }
  }

  if (loginForm) {
    loginForm.addEventListener("submit", onLoginFormSubmit);
  }
}

export function initRegisterForm() {
  const registerForm = document.querySelector("#registerForm");

  async function onRegisterFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formFields = Object.fromEntries(formData);

    if (!formFields.name || !formFields.email || !formFields.password) {
      alert("Please fill in all required fields (name, email, and password).");
      return;
    }

    if (!formFields.email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    if (formFields.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    if (!formFields.avatar || formFields.avatar.trim() === "") {
      delete formFields.avatar;
    } else {
      formFields.avatar = {
        url: formFields.avatar.trim(),
        alt: formFields.name || "User avatar",
      };
    }

    try {
      const result = await registerUser(formFields);

      if (result && result.data) {
        alert("Registration successful! Please log in with your credentials.");
        window.location.href = "../pages/login.html";
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert(
        error.message ||
          "Failed to register. Please check your information and try again.",
      );
    }
  }

  if (registerForm) {
    registerForm.addEventListener("submit", onRegisterFormSubmit);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initLoginForm();
  initRegisterForm();
});
