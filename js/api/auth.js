import { addToLocalStorage, saveUser } from "../utils/storage.js";
import { AUTH_URL } from "./config.js";

export async function loginUser(userDetails) {
  try {
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(userDetails),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(`${AUTH_URL}/login`, fetchOptions);
    const json = await response.json();

    if (!response.ok) {
      const errorMessage = json.errors?.[0]?.message || "Login failed";
      throw new Error(`Unable to log in: ${errorMessage}`);
    }

    if (!json.data || !json.data.accessToken) {
      throw new Error(
        "Login successful but access token is missing. Please try again.",
      );
    }

    const accessToken = json.data.accessToken;
    addToLocalStorage("accessToken", accessToken);
    saveUser(json.data);
    console.log(json);
    return json;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function registerUser(userDetails) {
  try {
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(userDetails),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(`${AUTH_URL}/register`, fetchOptions);
    const json = await response.json();

    if (!response.ok) {
      const errorMessage = json.errors?.[0]?.message || "Registration failed";
      throw new Error(`Unable to register: ${errorMessage}`);
    }

    if (!json.data) {
      throw new Error("Registration successful but user data is missing.");
    }

    console.log(json);
    return json;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}
