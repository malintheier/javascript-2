import { fetchSinglePost } from "../api/posts.js";
import { getParam } from "../utils/getParam.js";

export function renderPostCard(post) {
  const postContainer = document.createElement("div");
  postContainer.classList.add("post-card");
  postContainer.style.cursor = "pointer";

  const title = document.createElement("h2");
  title.textContent = post.title;

  const body = document.createElement("p");
  body.textContent = post.body;

  const author = document.createElement("p");
  author.textContent = `Author: ${post.author?.name || "Unknown"}`;

  if (post.media?.url) {
    const image = document.createElement("img");
    image.src = post.media.url;
    image.alt = post.media.alt || "";
    postContainer.append(image);
  }

  postContainer.append(title, body, author);

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
    const postCard = renderPostCard(post);
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
