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
    const profileCard = document.createElement("div");
    profileCard.className = "profile-card";
    profileCard.innerHTML = `
      <div class="profile-card-header">
        ${profile.avatar?.url ? `<img src="${profile.avatar.url}" alt="${profile.avatar.alt || profile.name}" class="profile-avatar" />` : ""}
        <div>
          <h3><a href="profile.html?name=${profile.name}">${profile.name}</a></h3>
          ${profile.bio ? `<p>${profile.bio}</p>` : ""}
        </div>
      </div>
      ${profile.banner?.url ? `<img src="${profile.banner.url}" alt="${profile.banner.alt || ""}" class="profile-banner" />` : ""}
    `;
    displayContainer.append(profileCard);
  });
}
