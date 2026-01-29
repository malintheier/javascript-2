import { renderPostCard } from "./renderPostCard.js";

export function generatePostsHTML(posts, displayContainer) {
  if (!displayContainer) {
    console.error("Cannot generate posts: display container element is missing");
    return;
  }

  displayContainer.innerHTML = "";

  if (!posts) {
    console.error("Cannot generate posts: posts data is missing");
    displayContainer.innerHTML = "<p class='error-message'>Unable to display posts: data is missing.</p>";
    return;
  }

  if (!Array.isArray(posts)) {
    console.error("Cannot generate posts: posts data is not an array");
    displayContainer.innerHTML = "<p class='error-message'>Unable to display posts: invalid data format.</p>";
    return;
  }

  if (posts.length === 0) {
    displayContainer.innerHTML = "<p>No posts to display yet. Be the first to create a post!</p>";
    return;
  }

  try {
    for (let i = 0; i < posts.length; i++) {
      const postCard = renderPostCard(posts[i], false);
      displayContainer.append(postCard);
    }
  } catch (error) {
    console.error("Error rendering posts:", error);
    displayContainer.innerHTML += "<p class='error-message'>Some posts could not be displayed.</p>";
  }
}

export function displayProfiles(profiles, displayContainer) {
  if (!displayContainer) {
    console.error("Cannot display profiles: display container element is missing");
    return;
  }

  displayContainer.innerHTML = "";

  if (!profiles) {
    console.error("Cannot display profiles: profiles data is missing");
    displayContainer.innerHTML = "<p class='error-message'>Unable to display profiles: data is missing.</p>";
    return;
  }

  if (!Array.isArray(profiles)) {
    console.error("Cannot display profiles: profiles data is not an array");
    displayContainer.innerHTML = "<p class='error-message'>Unable to display profiles: invalid data format.</p>";
    return;
  }

  if (profiles.length === 0) {
    displayContainer.innerHTML = "<p>No profiles found.</p>";
    return;
  }

  try {
    profiles.forEach((profile) => {
      if (!profile || !profile.name) {
        console.warn("Skipping profile with missing data");
        return;
      }

      const profileCard = document.createElement("a");
      profileCard.className = "profile-search-card";
      profileCard.href = `profile.html?name=${profile.name}`;

      const avatar = document.createElement("img");
      avatar.src =
        profile.avatar?.url || "https://placehold.co/50x50/333/fff?text=User";
      avatar.alt = profile.avatar?.alt || profile.name;
      avatar.className = "profile-search-avatar";

      const name = document.createElement("span");
      name.className = "profile-search-name";
      name.textContent = profile.name;

      profileCard.append(avatar, name);
      displayContainer.append(profileCard);
    });
  } catch (error) {
    console.error("Error displaying profiles:", error);
    displayContainer.innerHTML += "<p class='error-message'>Some profiles could not be displayed.</p>";
  }
}
