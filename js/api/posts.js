import { getFromLocalStorage } from "../utils/storage.js";
import { SOCIAL_URL, NOROFF_API_KEY } from "./config.js";

export async function fetchPosts() {
  try {
    const accessToken = getFromLocalStorage("accessToken");
    const fetchOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY,
      },
    };
    const response = await fetch(
      `${SOCIAL_URL}/posts?_author=true`,
      fetchOptions,
    );
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchSinglePost(id) {
  try {
    const accessToken = getFromLocalStorage("accessToken");
    const fetchOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY,
      },
    };
    const response = await fetch(
      `${SOCIAL_URL}/posts/${id}?_author=true`,
      fetchOptions,
    );
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.log(error);
  }
}

export async function createPost(postData) {
  try {
    const accessToken = getFromLocalStorage("accessToken");

    // Automatically add Pulse2026 tag
    if (!postData.tags) {
      postData.tags = [];
    }
    if (!postData.tags.includes("Pulse2026")) {
      postData.tags.push("Pulse2026");
    }

    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY,
      },
      body: JSON.stringify(postData),
    };
    const response = await fetch(`${SOCIAL_URL}/posts`, fetchOptions);
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePost(id, postData) {
  try {
    const accessToken = getFromLocalStorage("accessToken");

    // Ensure Pulse2026 tag remains
    if (!postData.tags) {
      postData.tags = [];
    }
    if (!postData.tags.includes("Pulse2026")) {
      postData.tags.push("Pulse2026");
    }

    const fetchOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY,
      },
      body: JSON.stringify(postData),
    };
    const response = await fetch(`${SOCIAL_URL}/posts/${id}`, fetchOptions);
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(id) {
  try {
    const accessToken = getFromLocalStorage("accessToken");
    const fetchOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY,
      },
    };
    await fetch(`${SOCIAL_URL}/posts/${id}`, fetchOptions);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
