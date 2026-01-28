import { renderPostCard } from "./renderPostCard.js";

export function generatePostsHTML(posts, displayContainer) {
  displayContainer.innerHTML = "";

  for (let i = 0; i < posts.length; i++) {
    const postCard = renderPostCard(posts[i], false);
    displayContainer.append(postCard);
  }
}

export function displayProfiles(profiles, displayContainer) {
  displayContainer.innerHTML = "";

  if (profiles.length === 0) {
    displayContainer.innerHTML = "<p>No profiles found.</p>";
    return;
  }

  profiles.forEach((profile) => {
    const profileCard = document.createElement("a");
    profileCard.className = "profile-search-card";
    profileCard.href = `profile.html?name=${profile.name}`;

    const avatar = document.createElement("img");
    avatar.src = profile.avatar?.url || "https://via.placeholder.com/50";
    avatar.alt = profile.avatar?.alt || profile.name;
    avatar.className = "profile-search-avatar";

    const name = document.createElement("span");
    name.className = "profile-search-name";
    name.textContent = profile.name;

    profileCard.append(avatar, name);
    displayContainer.append(profileCard);
  });
}
