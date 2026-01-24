import { API_BASE, SOCIAL_URL, NOROFF_API_KEY } from "./config.js";
import { getFromLocalStorage } from "../utils/storage.js";

export async function fetchProfile(username) {
  const accessToken = getFromLocalStorage("accessToken");

  const response = await fetch(
    `${SOCIAL_URL}/profiles/${username}?_posts=true`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY,
      },
    },
  );

  if (response.ok) {
    const result = await response.json();
    return result.data;
  }

  return null;
}
