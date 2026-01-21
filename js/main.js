import { fetchPosts, createPost } from "./api/posts.js";
import { generatePostsHTML } from "./modules/renderPostList.js";
import { requireAuth } from "./utils/authGuard.js";
import { showModal, showMessage } from "./utils/showMessage.js";

const displayContainer = document.getElementById("displayContainer");

export async function loadFeed() {
  const posts = await fetchPosts();

  // Filter posts to only show those with "Pulse2026" tag
  const filteredPosts = posts.filter(
    (post) => post.tags && post.tags.includes("Pulse2026"),
  );

  generatePostsHTML(filteredPosts, displayContainer);
}

function openCreatePostModal() {
  const formHTML = `
    <form id="createPostForm" class="post-form">
      <label for="title">Title:</label>
      <input type="text" id="title" name="title" required class="form-input" />
      
      <label for="body">Body:</label>
      <textarea id="body" name="body" required class="form-textarea"></textarea>
      
      <label for="mediaUrl">Media URL (optional):</label>
      <input type="url" id="mediaUrl" name="mediaUrl" class="form-input" />
      
      <label for="mediaAlt">Media Alt Text (optional):</label>
      <input type="text" id="mediaAlt" name="mediaAlt" class="form-input" />
      
      <button type="submit" class="btn btn-primary">Create Post</button>
    </form>
  `;

  const modal = showModal("Create New Post", formHTML);

  const form = modal.querySelector("#createPostForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const postData = {
      title: formData.get("title"),
      body: formData.get("body"),
    };

    const mediaUrl = formData.get("mediaUrl");
    if (mediaUrl) {
      postData.media = {
        url: mediaUrl,
        alt: formData.get("mediaAlt") || "",
      };
    }

    const result = await createPost(postData);

    if (result) {
      showMessage("Post created successfully!", "success");
      modal.remove();
      loadFeed();
    } else {
      showMessage("Failed to create post", "error");
    }
  });
}

async function main() {
  if (!requireAuth()) return;

  await loadFeed();

  const createBtn = document.getElementById("createPostBtn");
  if (createBtn) {
    createBtn.addEventListener("click", openCreatePostModal);
  }
}

main();
