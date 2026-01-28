import { fetchSinglePost } from "../api/posts.js";
import { getParam } from "../utils/getParam.js";
import { getUser } from "../utils/storage.js";

export function renderPostCard(post, showEditButton = false) {
  const postContainer = document.createElement("div");
  postContainer.classList.add("post-card");
  postContainer.style.cursor = "pointer";

  // Extract artist and song from tags
  const artistTag = post.tags?.find((tag) => tag.startsWith("artist:"));
  const songTag = post.tags?.find((tag) => tag.startsWith("song:"));
  const artist = artistTag ? artistTag.replace("artist:", "") : "";
  const song = songTag ? songTag.replace("song:", "") : "";

  // 1. Author
  const authorContainer = document.createElement("p");

  const authorLink = document.createElement("a");
  authorLink.textContent = post.author?.name || "Unknown";
  authorLink.href = `profile.html?name=${post.author?.name || ""}`;
  authorLink.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  authorContainer.appendChild(authorLink);
  postContainer.append(authorContainer);

  // 2. Image
  if (post.media?.url) {
    const image = document.createElement("img");
    image.src = post.media.url;
    image.alt = post.media.alt || "";
    postContainer.append(image);
  }

  // 3. Song
  if (song) {
    const songElement = document.createElement("p");
    songElement.classList.add("post-song");
    songElement.textContent = song;
    postContainer.append(songElement);
  }

  // 4. Artist
  if (artist) {
    const artistElement = document.createElement("p");
    artistElement.classList.add("post-artist");
    artistElement.textContent = artist;
    postContainer.append(artistElement);
  }

  // 5. Title
  const title = document.createElement("h2");
  title.textContent = post.title;
  postContainer.append(title);

  // 6. Body
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
