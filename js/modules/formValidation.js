import { loginUser } from "../api/auth.js";
import { registerUser } from "../api/auth.js";

export function initLoginForm() {
  const loginForm = document.querySelector("#loginForm");

  async function onLoginFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formFields = Object.fromEntries(formData);
    const result = await loginUser(formFields);

    if (result && result.data) {
      window.location.href = "../pages/feed.html";
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

    // Remove empty avatar field if not provided
    if (!formFields.avatar || formFields.avatar.trim() === "") {
      delete formFields.avatar;
    } else {
      // Wrap avatar URL in required object format
      formFields.avatar = {
        url: formFields.avatar.trim(),
        alt: formFields.name || "User avatar",
      };
    }

    const result = await registerUser(formFields);

    if (result && result.data) {
      window.location.href = "../pages/login.html";
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
