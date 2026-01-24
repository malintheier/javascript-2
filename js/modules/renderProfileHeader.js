export function renderProfileHeader(profile) {
  const container = document.createElement("div");
  container.className = "profile-header";

  const avatar = document.createElement("img");
  avatar.src = profile.avatar?.url || "https://via.placeholder.com/150";
  avatar.alt = profile.avatar?.alt || profile.name;
  avatar.className = "profile-avatar";

  const name = document.createElement("h1");
  name.textContent = profile.name;
  name.className = "profile-name";

  container.appendChild(avatar);
  container.appendChild(name);

  return container;
}
