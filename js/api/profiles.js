import { API_BASE, SOCIAL_URL, NOROFF_API_KEY } from "./config.js";
import { getFromLocalStorage } from "../utils/storage.js";

export async function fetchProfile(username) {
  try {
    if (!username) {
      throw new Error("Username is required to fetch a profile.");
    }

    const accessToken = getFromLocalStorage("accessToken");

    if (!accessToken) {
      throw new Error(
        "You must be logged in to view profiles. Please log in and try again.",
      );
    }

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

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Profile '${username}' could not be found.`);
      }
      const errorMessage =
        result.errors?.[0]?.message || "Failed to load profile";
      throw new Error(`Unable to fetch profile: ${errorMessage}`);
    }

    if (!result.data) {
      throw new Error("Profile data is missing from the server response.");
    }

    return result.data;
  } catch (error) {
    console.error("Fetch profile error:", error);
    throw error;
  }
}

export async function followUser(username) {
  try {
    if (!username) {
      throw new Error("Username is required to follow a user.");
    }

    const accessToken = getFromLocalStorage("accessToken");

    if (!accessToken) {
      throw new Error(
        "You must be logged in to follow users. Please log in and try again.",
      );
    }

    const response = await fetch(`${SOCIAL_URL}/profiles/${username}/follow`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`User '${username}' could not be found.`);
      }
      const errorMessage =
        result.errors?.[0]?.message || "Failed to follow user";
      throw new Error(`Unable to follow user: ${errorMessage}`);
    }

    if (!result.data) {
      throw new Error(
        "Follow action completed but no data was returned from the server.",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Follow user error:", error);
    throw error;
  }
}

export async function unfollowUser(username) {
  try {
    if (!username) {
      throw new Error("Username is required to unfollow a user.");
    }

    const accessToken = getFromLocalStorage("accessToken");

    if (!accessToken) {
      throw new Error(
        "You must be logged in to unfollow users. Please log in and try again.",
      );
    }

    const response = await fetch(
      `${SOCIAL_URL}/profiles/${username}/unfollow`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": NOROFF_API_KEY,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`User '${username}' could not be found.`);
      }
      const errorMessage =
        result.errors?.[0]?.message || "Failed to unfollow user";
      throw new Error(`Unable to unfollow user: ${errorMessage}`);
    }

    if (!result.data) {
      throw new Error(
        "Unfollow action completed but no data was returned from the server.",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Unfollow user error:", error);
    throw error;
  }
}

export async function updateProfileBio(username, bio) {
  try {
    if (!username) {
      throw new Error("Username is required to update profile bio.");
    }

    if (bio === undefined || bio === null) {
      throw new Error("Bio content is required to update profile.");
    }

    const accessToken = getFromLocalStorage("accessToken");

    if (!accessToken) {
      throw new Error(
        "You must be logged in to update your profile. Please log in and try again.",
      );
    }

    const response = await fetch(`${SOCIAL_URL}/profiles/${username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY,
      },
      body: JSON.stringify({ bio }),
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to update this profile.");
      }
      const errorMessage =
        result.errors?.[0]?.message || "Failed to update bio";
      throw new Error(`Unable to update profile bio: ${errorMessage}`);
    }

    if (!result.data) {
      throw new Error(
        "Profile bio was updated but no data was returned from the server.",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Update profile bio error:", error);
    throw error;
  }
}

export async function updateProfileAvatar(username, avatarUrl, altText) {
  try {
    if (!username) {
      throw new Error("Username is required to update profile avatar.");
    }

    if (!avatarUrl) {
      throw new Error("Avatar URL is required to update profile avatar.");
    }

    const accessToken = getFromLocalStorage("accessToken");

    if (!accessToken) {
      throw new Error(
        "You must be logged in to update your profile. Please log in and try again.",
      );
    }

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

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to update this profile.");
      }
      const errorMessage =
        result.errors?.[0]?.message || "Failed to update avatar";
      throw new Error(`Unable to update profile avatar: ${errorMessage}`);
    }

    if (!result.data) {
      throw new Error(
        "Profile avatar was updated but no data was returned from the server.",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Update profile avatar error:", error);
    throw error;
  }
}

export async function searchProfiles(query) {
  try {
    if (!query || query.trim() === "") {
      throw new Error("Please enter a search term to find profiles.");
    }

    const accessToken = getFromLocalStorage("accessToken");

    if (!accessToken) {
      throw new Error(
        "You must be logged in to search profiles. Please log in and try again.",
      );
    }

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

    const result = await response.json();

    if (!response.ok) {
      const errorMessage = result.errors?.[0]?.message || "Search failed";
      throw new Error(`Unable to search profiles: ${errorMessage}`);
    }

    if (!result.data) {
      throw new Error("No search results data received from the server.");
    }

    return result.data;
  } catch (error) {
    console.error("Search profiles error:", error);
    throw error;
  }
}
