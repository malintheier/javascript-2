import { fetchSinglePost } from "../api/posts.js";
import { getParam } from "../utils/getParam.js";
import { getUser } from "../utils/storage.js";

export function renderPostCard(post, showEditButton = false) {
  const postContainer = document.createElement("div");
  postContainer.classList.add("post-card");
  postContainer.style.cursor = "pointer";

  const artistTag = post.tags?.find((tag) => tag.startsWith("artist:"));
  const songTag = post.tags?.find((tag) => tag.startsWith("song:"));
  const artist = artistTag ? artistTag.replace("artist:", "") : "";
  const song = songTag ? songTag.replace("song:", "") : "";

  const authorContainer = document.createElement("p");
  authorContainer.classList.add("post-author");

  const authorLink = document.createElement("a");
  authorLink.textContent = post.author?.name || "Unknown";
  authorLink.href = `profile.html?name=${post.author?.name || ""}`;
  authorLink.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  authorContainer.appendChild(authorLink);
  postContainer.append(authorContainer);

  if (post.media?.url || song || artist) {
    const mediaSection = document.createElement("div");
    mediaSection.classList.add("post-card-media-section");

    if (post.media?.url) {
      const image = document.createElement("img");
      image.src = post.media.url;
      image.alt = post.media.alt || "";
      mediaSection.append(image);
    }

    const infoContainer = document.createElement("div");
    infoContainer.classList.add("post-card-info");

    if (song) {
      const songElement = document.createElement("p");
      songElement.classList.add("post-song");
      songElement.textContent = song;
      infoContainer.append(songElement);
    }

    if (artist) {
      const artistElement = document.createElement("p");
      artistElement.classList.add("post-artist");
      artistElement.textContent = artist;
      infoContainer.append(artistElement);
    }

    if (infoContainer.children.length > 0) {
      mediaSection.append(infoContainer);
    }

    postContainer.append(mediaSection);
  }

  const title = document.createElement("h2");
  title.classList.add("post-title");
  title.textContent = post.title;
  postContainer.append(title);

  const body = document.createElement("p");
  body.textContent = post.body;
  postContainer.append(body);

  if (showEditButton) {
    const currentUser = getUser();

    const isOwner =
      currentUser &&
      post.author &&
      (post.author.name === currentUser.name ||
        post.author.email === currentUser.email);

    if (isOwner) {
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("post-buttons");

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit Post";
      editBtn.classList.add("btn-edit");
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const event = new CustomEvent("editPost", { detail: post });
        window.dispatchEvent(event);
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete Post";
      deleteBtn.classList.add("btn-delete");
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const event = new CustomEvent("deletePost", { detail: post });
        window.dispatchEvent(event);
      });

      buttonContainer.append(editBtn, deleteBtn);
      postContainer.append(buttonContainer);
    }
  }

  postContainer.addEventListener("click", () => {
    window.location.href = `post.html?id=${post.id}`;
  });

  return postContainer;
}

export async function displaySinglePost() {
  const postContainer = document.getElementById("postContainer");
  const postId = getParam("id");

  if (!postId) {
    postContainer.innerHTML = "<p>No post ID provided</p>";
    return;
  }

  const post = await fetchSinglePost(postId);

  if (post) {
    const postCard = renderPostCard(post, true);
    postCard.style.cursor = "default";
    postCard.onclick = null;
    postContainer.append(postCard);
  } else {
    postContainer.innerHTML = "<p>Post not found</p>";
  }
}

if (document.getElementById("postContainer")) {
  displaySinglePost();
}
