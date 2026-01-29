import { getFromLocalStorage } from "../utils/storage.js";
import { SOCIAL_URL, NOROFF_API_KEY } from "./config.js";

export async function fetchPosts() {
  try {
    const accessToken = getFromLocalStorage("accessToken");

    if (!accessToken) {
      throw new Error(
        "You must be logged in to view posts. Please log in and try again.",
      );
    }

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

    if (!response.ok) {
      const errorMessage = json.errors?.[0]?.message || "Failed to load posts";
      throw new Error(`Unable to fetch posts: ${errorMessage}`);
    }

    if (!json.data) {
      throw new Error("No posts data received from the server.");
    }

    return json.data;
  } catch (error) {
    console.error("Fetch posts error:", error);
    throw error;
  }
}

export async function fetchSinglePost(id) {
  try {
    if (!id) {
      throw new Error("Post ID is required to fetch a post.");
    }

    const accessToken = getFromLocalStorage("accessToken");

    if (!accessToken) {
      throw new Error(
        "You must be logged in to view this post. Please log in and try again.",
      );
    }

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

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          "This post could not be found. It may have been deleted.",
        );
      }
      const errorMessage = json.errors?.[0]?.message || "Failed to load post";
      throw new Error(`Unable to fetch post: ${errorMessage}`);
    }

    if (!json.data) {
      throw new Error("Post data is missing from the server response.");
    }

    return json.data;
  } catch (error) {
    console.error("Fetch single post error:", error);
    throw error;
  }
}

export async function createPost(postData) {
  try {
    if (!postData || !postData.title || !postData.body) {
      throw new Error("Post must have a title and body to be created.");
    }

    const accessToken = getFromLocalStorage("accessToken");

    if (!accessToken) {
      throw new Error(
        "You must be logged in to create a post. Please log in and try again.",
      );
    }

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

    if (!response.ok) {
      const errorMessage = json.errors?.[0]?.message || "Failed to create post";
      throw new Error(`Unable to create post: ${errorMessage}`);
    }

    if (!json.data) {
      throw new Error(
        "Post was created but the server did not return the post data.",
      );
    }

    return json.data;
  } catch (error) {
    console.error("Create post error:", error);
    throw error;
  }
}

export async function updatePost(id, postData) {
  try {
    const accessToken = getFromLocalStorage("accessToken");

    const updateData = {};

    if (postData.title !== undefined) {
      updateData.title = postData.title;
    }
    if (postData.body !== undefined) {
      updateData.body = postData.body;
    }
    if (postData.media !== undefined) {
      updateData.media = postData.media;
    }
    if (postData.tags !== undefined) {
      updateData.tags = postData.tags;
    } else {
      updateData.tags = [];
    }

    if (!updateData.tags.includes("Pulse2026")) {
      updateData.tags.push("Pulse2026");
    }

    const fetchOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY,
      },
      body: JSON.stringify(updateData),
    };
    const response = await fetch(`${SOCIAL_URL}/posts/${id}`, fetchOptions);
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.errors?.[0]?.message || "Failed to update post");
    }

    return json.data;
  } catch (error) {
    throw error;
  }
}

export async function deletePost(id) {
  try {
    if (!id) {
      throw new Error("Post ID is required to delete a post.");
    }

    const accessToken = getFromLocalStorage("accessToken");

    if (!accessToken) {
      throw new Error(
        "You must be logged in to delete a post. Please log in and try again.",
      );
    }

    const fetchOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY,
      },
    };
    const response = await fetch(`${SOCIAL_URL}/posts/${id}`, fetchOptions);

    if (!response.ok) {
      const json = await response.json();
      if (response.status === 404) {
        throw new Error(
          "This post could not be found. It may have already been deleted.",
        );
      }
      if (response.status === 403) {
        throw new Error("You don't have permission to delete this post.");
      }
      const errorMessage = json.errors?.[0]?.message || "Failed to delete post";
      throw new Error(`Unable to delete post: ${errorMessage}`);
    }

    return true;
  } catch (error) {
    console.error("Delete post error:", error);
    throw error;
  }
}

export async function searchPosts(query) {
  try {
    if (!query || query.trim() === "") {
      throw new Error("Please enter a search term to find posts.");
    }

    const accessToken = getFromLocalStorage("accessToken");

    if (!accessToken) {
      throw new Error(
        "You must be logged in to search posts. Please log in and try again.",
      );
    }

    const fetchOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY,
      },
    };
    const response = await fetch(
      `${SOCIAL_URL}/posts/search?q=${encodeURIComponent(query)}&_author=true`,
      fetchOptions,
    );
    const json = await response.json();

    if (!response.ok) {
      const errorMessage = json.errors?.[0]?.message || "Search failed";
      throw new Error(`Unable to search posts: ${errorMessage}`);
    }

    if (!json.data) {
      throw new Error("No search results data received from the server.");
    }

    return json.data;
  } catch (error) {
    console.error("Search posts error:", error);
    throw error;
  }
}
