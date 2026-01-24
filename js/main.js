import { fetchPosts, createPost, updatePost, deletePost } from "./api/posts.js";
import { generatePostsHTML } from "./modules/renderPostList.js";
import { requireAuth } from "./utils/authGuard.js";
import { showModal, showMessage } from "./utils/showMessage.js";

const displayContainer = document.getElementById("displayContainer");

export async function loadFeed() {
  const posts = await fetchPosts();

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

function openEditPostModal(post) {
  const formHTML = `
    <form id="editPostForm" class="post-form">
      <label for="editTitle">Title:</label>
      <input type="text" id="editTitle" name="title" required class="form-input" value="${post.title}" />
      
      <label for="editBody">Body:</label>
      <textarea id="editBody" name="body" required class="form-textarea">${post.body}</textarea>
      
      <label for="editMediaUrl">Media URL (optional):</label>
      <input type="url" id="editMediaUrl" name="mediaUrl" class="form-input" value="${post.media?.url || ""}" />
      
      <label for="editMediaAlt">Media Alt Text (optional):</label>
      <input type="text" id="editMediaAlt" name="mediaAlt" class="form-input" value="${post.media?.alt || ""}" />
      
      <button type="submit" class="btn btn-primary">Update Post</button>
    </form>
  `;

  const modal = showModal("Edit Post", formHTML);

  const form = modal.querySelector("#editPostForm");
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

    const result = await updatePost(post.id, postData);

    if (result) {
      showMessage("Post updated successfully!", "success");
      modal.remove();

      if (displayContainer) {
        loadFeed();
      } else {
        location.reload();
      }
    } else {
      showMessage("Failed to update post", "error");
    }
  });
}

async function loadProfile() {
  const { getUser } = await import("./utils/storage.js");
  const { fetchProfile } = await import("./api/profiles.js");
  const { renderProfileHeader } =
    await import("./modules/renderProfileHeader.js");
  const { generatePostsHTML } = await import("./modules/renderPostList.js");

  const user = getUser();
  if (!user) return;

  const profile = await fetchProfile(user.name);
  if (!profile) return;

  const headerContainer = document.getElementById("profileHeader");
  const postsContainer = document.getElementById("profilePosts");

  if (headerContainer) {
    const header = renderProfileHeader(profile);
    headerContainer.appendChild(header);
  }

  if (postsContainer && profile.posts) {
    generatePostsHTML(profile.posts, postsContainer);
  }
}

async function main() {
  if (!requireAuth()) return;

  if (displayContainer) {
    await loadFeed();
  }

  const profileHeader = document.getElementById("profileHeader");
  if (profileHeader) {
    await loadProfile();
  }

  const createBtn = document.getElementById("createPostBtn");
  if (createBtn) {
    createBtn.addEventListener("click", openCreatePostModal);
  }

  window.addEventListener("editPost", (e) => {
    openEditPostModal(e.detail);
  });

  window.addEventListener("deletePost", async (e) => {
    if (confirm("Are you sure you want to delete this post?")) {
      const result = await deletePost(e.detail.id);
      if (result) {
        showMessage("Post deleted successfully!", "success");

        if (displayContainer) {
          loadFeed();
        } else {
          window.location.href = "feed.html";
        }
      } else {
        showMessage("Failed to delete post", "error");
      }
    }
  });
}

main();
