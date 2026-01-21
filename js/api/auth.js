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
    const accessToken = json.data.accessToken;
    addToLocalStorage("accessToken", accessToken);
    saveUser(json.data);
    console.log(json);
    return json;
  } catch (error) {
    console.log(error);
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
    console.log(json);
    return json;
  } catch (error) {
    console.log(error);
  }
}
