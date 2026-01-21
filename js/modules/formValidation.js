import { loginUser } from "../api/auth.js";
import { registerUser } from "../api/auth.js";

export function initLoginForm() {
  const loginForm = document.querySelector("#loginForm");

  function onLoginFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formFields = Object.fromEntries(formData);
    loginUser(formFields);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", onLoginFormSubmit);
  }
}

export function initRegisterForm() {
  const registerForm = document.querySelector("#registerForm");

  function onRegisterFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formFields = Object.fromEntries(formData);
    registerUser(formFields);
  }

  if (registerForm) {
    registerForm.addEventListener("submit", onRegisterFormSubmit);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initLoginForm();
  initRegisterForm();
});
