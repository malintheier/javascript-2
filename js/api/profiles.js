import { API_BASE, SOCIAL_URL, NOROFF_API_KEY } from "./config.js";
import { getFromLocalStorage } from "../utils/storage.js";

export async function fetchProfile(username) {
  const accessToken = getFromLocalStorage("accessToken");

  const response = await fetch(
    `${SOCIAL_URL}/profiles/${username}?_posts=true&_author=true&_followers=true&_following=true`,
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

export async function followUser(username) {
  const accessToken = getFromLocalStorage("accessToken");

  const response = await fetch(`${SOCIAL_URL}/profiles/${username}/follow`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": NOROFF_API_KEY,
    },
  });

  if (response.ok) {
    const result = await response.json();
    return result.data;
  }

  return null;
}

export async function unfollowUser(username) {
  const accessToken = getFromLocalStorage("accessToken");

  const response = await fetch(`${SOCIAL_URL}/profiles/${username}/unfollow`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": NOROFF_API_KEY,
    },
  });

  if (response.ok) {
    const result = await response.json();
    return result.data;
  }

  return null;
}

export async function updateProfileBio(username, bio) {
  const accessToken = getFromLocalStorage("accessToken");

  const response = await fetch(`${SOCIAL_URL}/profiles/${username}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": NOROFF_API_KEY,
    },
    body: JSON.stringify({ bio }),
  });

  if (response.ok) {
    const result = await response.json();
    return result.data;
  }

  return null;
}

export async function updateProfileAvatar(username, avatarUrl, altText) {
  const accessToken = getFromLocalStorage("accessToken");

  const response = await fetch(`${SOCIAL_URL}/profiles/${username}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": NOROFF_API_KEY,
    },
    body: JSON.stringify({
      avatar: {
        url: avatarUrl,
        alt: altText,
      },
    }),
  });

  if (response.ok) {
    const result = await response.json();
    return result.data;
  }

  return null;
}

export async function searchProfiles(query) {
  const accessToken = getFromLocalStorage("accessToken");

  const response = await fetch(
    `${SOCIAL_URL}/profiles/search?q=${encodeURIComponent(query)}`,
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

  return [];
}
