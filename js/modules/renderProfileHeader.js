export function renderProfileHeader(
  profile,
  isOwnProfile = false,
  currentUser = null,
) {
  if (!profile) {
    console.error("Cannot render profile header: profile data is missing");
    const errorContainer = document.createElement("div");
    errorContainer.className = "profile-header error";
    errorContainer.innerHTML =
      "<p class='error-message'>Unable to display profile: profile data is missing.</p>";
    return errorContainer;
  }

  if (!profile.name) {
    console.error("Cannot render profile header: profile name is missing");
    const errorContainer = document.createElement("div");
    errorContainer.className = "profile-header error";
    errorContainer.innerHTML =
      "<p class='error-message'>Unable to display profile: profile name is missing.</p>";
    return errorContainer;
  }

  try {
    const container = document.createElement("div");
    container.className = "profile-header";

    const avatar = document.createElement("img");
    avatar.src =
      profile.avatar?.url || "https://placehold.co/150x150/333/fff?text=User";
    avatar.alt = profile.avatar?.alt || profile.name;
    avatar.className = "profile-avatar";

    const name = document.createElement("h1");
    name.textContent = profile.name;
    name.className = "profile-name";

    const bio = document.createElement("p");
    bio.id = "profileBio";
    bio.textContent = profile.bio || "No bio yet.";
    bio.className = "profile-bio";

    const counts = document.createElement("div");
    counts.className = "profile-counts";
    counts.innerHTML = `
    <span>Posts: ${profile._count?.posts || 0}</span>
    <span id="followerCount">Followers: ${profile._count?.followers || 0}</span>
    <span>Following: ${profile._count?.following || 0}</span>
  `;

    container.appendChild(avatar);
    container.appendChild(name);
    container.appendChild(bio);
    container.appendChild(counts);

    if (isOwnProfile) {
      const editBioBtn = document.createElement("button");
      editBioBtn.id = "editBioBtn";
      editBioBtn.className = "btn-edit-bio";
      editBioBtn.textContent = "Edit Bio";
      container.appendChild(editBioBtn);

      const editAvatarBtn = document.createElement("button");
      editAvatarBtn.id = "editAvatarBtn";
      editAvatarBtn.className = "btn-edit-bio";
      editAvatarBtn.textContent = "Edit Avatar";
      container.appendChild(editAvatarBtn);
    }

    if (!isOwnProfile && currentUser) {
      const isFollowing =
        Array.isArray(profile.followers) &&
        profile.followers.some((f) => f.name === currentUser.name);

      const followBtn = document.createElement("button");
      followBtn.id = "followBtn";
      followBtn.className = isFollowing ? "btn-unfollow" : "btn-follow";
      followBtn.textContent = isFollowing ? "Unfollow" : "Follow";
      followBtn.dataset.following = isFollowing.toString();

      container.appendChild(followBtn);
    }

    return container;
  } catch (error) {
    console.error("Error rendering profile header:", error);
    const errorContainer = document.createElement("div");
    errorContainer.className = "profile-header error";
    errorContainer.innerHTML =
      "<p class='error-message'>Unable to display profile header properly.</p>";
    return errorContainer;
  }
}
