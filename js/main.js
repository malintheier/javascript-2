import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
  searchPosts,
} from "./api/posts.js";
import { searchProfiles } from "./api/profiles.js";
import {
  generatePostsHTML,
  displayProfiles,
} from "./modules/renderPostList.js";
import { requireAuth } from "./utils/authGuard.js";
import {
  showModal,
  showMessage,
  openCreatePostModal,
  openEditPostModal,
} from "./utils/showMessage.js";

const displayContainer = document.getElementById("displayContainer");

export async function loadFeed() {
  const posts = await fetchPosts();

  const filteredPosts = posts.filter(
    (post) => post.tags && post.tags.includes("Pulse2026"),
  );

  generatePostsHTML(filteredPosts, displayContainer);
}

async function handleSearch(query, searchType) {
  if (!query.trim()) {
    loadFeed();
    return;
  }

  if (searchType === "posts") {
    const results = await searchPosts(query);
    const filteredResults = results.filter(
      (post) => post.tags && post.tags.includes("Pulse2026"),
    );
    generatePostsHTML(filteredResults, displayContainer);
  } else if (searchType === "profiles") {
    const profiles = await searchProfiles(query);
    displayProfiles(profiles, displayContainer);
  }
}

async function loadProfile() {
  const { getUser } = await import("./utils/storage.js");
  const { getParam } = await import("./utils/getParam.js");
  const { fetchProfile, followUser, unfollowUser, updateProfileBio } =
    await import("./api/profiles.js");
  const { renderProfileHeader } =
    await import("./modules/renderProfileHeader.js");
  const { generatePostsHTML } = await import("./modules/renderPostList.js");
  const { showMessage, showModal } = await import("./utils/showMessage.js");

  const usernameParam = getParam("name");
  const user = getUser();

  const username = usernameParam || user?.name;
  if (!username) return;

  const profile = await fetchProfile(username);
  if (!profile) return;

  const isOwnProfile = user && profile.name === user.name;

  const headerContainer = document.getElementById("profileHeader");
  const postsContainer = document.getElementById("profilePosts");

  if (headerContainer) {
    const header = renderProfileHeader(profile, isOwnProfile, user);
    headerContainer.appendChild(header);

    const followBtn = document.getElementById("followBtn");
    if (followBtn) {
      followBtn.addEventListener("click", async () => {
        const isFollowing = followBtn.dataset.following === "true";

        const result = isFollowing
          ? await unfollowUser(profile.name)
          : await followUser(profile.name);

        if (result) {
          followBtn.dataset.following = (!isFollowing).toString();
          followBtn.textContent = !isFollowing ? "Unfollow" : "Follow";
          followBtn.className = !isFollowing ? "btn-unfollow" : "btn-follow";

          const followerCountEl = document.getElementById("followerCount");
          if (followerCountEl) {
            const currentCount = profile._count?.followers || 0;
            const newCount = isFollowing ? currentCount - 1 : currentCount + 1;
            followerCountEl.textContent = `Followers: ${newCount}`;
            profile._count.followers = newCount;
          }

          showMessage(
            isFollowing ? "Unfollowed successfully!" : "Followed successfully!",
            "success",
          );
        } else {
          showMessage(
            isFollowing ? "Failed to unfollow" : "Failed to follow",
            "error",
          );
        }
      });
    }

    const editBioBtn = document.getElementById("editBioBtn");
    if (editBioBtn) {
      editBioBtn.addEventListener("click", () => {
        const formHTML = `
          <form id="editBioForm" class="bio-form">
            <label for="bioText">Bio:</label>
            <textarea id="bioText" name="bio" rows="4" maxlength="160" class="form-textarea">${profile.bio || ""}</textarea>
            <button type="submit" class="btn btn-primary">Save Bio</button>
          </form>
        `;

        const modal = showModal("Edit Bio", formHTML);

        const form = modal.querySelector("#editBioForm");
        form.addEventListener("submit", async (e) => {
          e.preventDefault();

          const formData = new FormData(form);
          const newBio = formData.get("bio");

          const result = await updateProfileBio(user.name, newBio);

          if (result) {
            showMessage("Bio updated successfully!", "success");
            modal.remove();

            const bioEl = document.getElementById("profileBio");
            if (bioEl) {
              bioEl.textContent = newBio || "No bio yet.";
              profile.bio = newBio;
            }
          } else {
            showMessage("Failed to update bio", "error");
          }
        });
      });
    }
  }

  if (postsContainer && profile.posts) {
    const postsWithAuthor = profile.posts.map((post) => ({
      ...post,
      author: post.author || {
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar,
        banner: profile.banner,
      },
    }));
    generatePostsHTML(postsWithAuthor, postsContainer);
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
    createBtn.addEventListener("click", () => {
      openCreatePostModal(createPost, loadFeed);
    });
  }

  const searchInput = document.getElementById("searchInput");
  const searchTypeRadios = document.querySelectorAll(
    'input[name="searchType"]',
  );

  if (searchInput && searchTypeRadios.length > 0) {
    let searchTimeout;

    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value;
      const searchType = document.querySelector(
        'input[name="searchType"]:checked',
      ).value;

      searchTimeout = setTimeout(() => {
        handleSearch(query, searchType);
      }, 300);
    });

    searchTypeRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        const query = searchInput.value;
        if (query.trim()) {
          handleSearch(query, radio.value);
        } else {
          loadFeed();
        }
      });
    });
  }

  window.addEventListener("editPost", (e) => {
    const onSuccess = () => {
      if (displayContainer) {
        loadFeed();
      } else {
        location.reload();
      }
    };
    openEditPostModal(e.detail, updatePost, onSuccess);
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
