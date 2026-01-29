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
  showDeleteConfirm,
} from "./utils/showMessage.js";

const displayContainer = document.getElementById("displayContainer");

export async function loadFeed() {
  try {
    if (!displayContainer) {
      console.error("loadFeed: displayContainer element not found");
      return;
    }

    displayContainer.innerHTML = "<p>Loading posts...</p>";
    const posts = await fetchPosts();

    const filteredPosts = posts.filter(
      (post) => post.tags && post.tags.includes("Pulse2026"),
    );

    generatePostsHTML(filteredPosts, displayContainer);
  } catch (error) {
    console.error("Error loading feed:", error);
    if (displayContainer) {
      displayContainer.innerHTML = `<p class='error-message'>${error.message || "Failed to load posts. Please try again later."}</p>`;
    }
    showMessage(
      error.message || "Failed to load posts. Please try again.",
      "error",
    );
  }
}

async function handleSearch(query, searchType) {
  try {
    if (!displayContainer) {
      console.error("handleSearch: displayContainer element not found");
      return;
    }

    if (!query.trim()) {
      loadFeed();
      return;
    }

    displayContainer.innerHTML = "<p>Searching...</p>";

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
  } catch (error) {
    console.error("Error during search:", error);
    if (displayContainer) {
      displayContainer.innerHTML = `<p class='error-message'>${error.message || "Search failed. Please try again."}</p>`;
    }
    showMessage(error.message || "Search failed. Please try again.", "error");
  }
}

async function loadProfile() {
  try {
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
    if (!username) {
      showMessage("No username provided to load profile.", "error");
      return;
    }

    const profile = await fetchProfile(username);
    if (!profile) {
      showMessage("Profile could not be loaded.", "error");
      return;
    }

    const isOwnProfile = user && profile.name === user.name;

    const headerContainer = document.getElementById("profileHeader");
    const postsContainer = document.getElementById("profilePosts");

    if (!headerContainer) {
      console.error("loadProfile: profileHeader element not found");
      return;
    }

    if (headerContainer) {
      const header = renderProfileHeader(profile, isOwnProfile, user);
      headerContainer.appendChild(header);

      const followBtn = document.getElementById("followBtn");
      if (followBtn) {
        followBtn.addEventListener("click", async () => {
          try {
            const isFollowing = followBtn.dataset.following === "true";

            const result = isFollowing
              ? await unfollowUser(profile.name)
              : await followUser(profile.name);

            if (result) {
              followBtn.dataset.following = (!isFollowing).toString();
              followBtn.textContent = !isFollowing ? "Unfollow" : "Follow";
              followBtn.className = !isFollowing
                ? "btn-unfollow"
                : "btn-follow";

              const followerCountEl = document.getElementById("followerCount");
              if (followerCountEl) {
                const currentCount = profile._count?.followers || 0;
                const newCount = isFollowing
                  ? currentCount - 1
                  : currentCount + 1;
                followerCountEl.textContent = `Followers: ${newCount}`;
                profile._count.followers = newCount;
              }

              showMessage(
                isFollowing
                  ? "Unfollowed successfully!"
                  : "Followed successfully!",
                "success",
              );
            }
          } catch (error) {
            console.error("Error following/unfollowing user:", error);
            showMessage(
              error.message ||
                "Failed to update follow status. Please try again.",
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

            try {
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
              }
            } catch (error) {
              console.error("Error updating bio:", error);
              showMessage(
                error.message || "Failed to update bio. Please try again.",
                "error",
              );
            }
          });
        });
      }

      const profileAvatar = document.getElementById("editAvatarBtn");
      if (profileAvatar) {
        profileAvatar.addEventListener("click", () => {
          const formHTML = `
          <form id="editAvatarForm" class="avatar-form">
            <label for="avatarUrl">Avatar URL:</label>
            <input type="url" id="avatarUrl" name="avatarUrl" value="${profile.avatar?.url || ""}" required class="form-input" />
            
            <label for="avatarAlt">Alt text:</label>
            <input type="text" id="avatarAlt" name="avatarAlt" value="${profile.avatar?.alt || profile.name}" class="form-input" />
            
            <button type="submit" class="btn btn-primary">Save Avatar</button>
          </form>
        `;

          const modal = showModal("Edit Avatar", formHTML);

          const form = modal.querySelector("#editAvatarForm");
          form.addEventListener("submit", async (e) => {
            e.preventDefault();

            try {
              const formData = new FormData(form);
              const avatarUrl = formData.get("avatarUrl");
              const avatarAlt = formData.get("avatarAlt");

              const { updateProfileAvatar } = await import("./api/profiles.js");
              const result = await updateProfileAvatar(
                user.name,
                avatarUrl,
                avatarAlt,
              );

              if (result) {
                showMessage("Avatar updated successfully!", "success");
                modal.remove();

                const avatarImg = document.querySelector(".profile-avatar");
                if (avatarImg) {
                  avatarImg.src = avatarUrl;
                  avatarImg.alt = avatarAlt;
                }
                profile.avatar = { url: avatarUrl, alt: avatarAlt };

                const navAvatars = document.querySelectorAll(
                  ".mobile-profile-avatar, .desktop-icon[alt='Profile Icon']",
                );
                navAvatars.forEach((img) => {
                  img.src = avatarUrl;
                  img.alt = avatarAlt;
                });
              }
            } catch (error) {
              console.error("Error updating avatar:", error);
              showMessage(
                error.message || "Failed to update avatar. Please try again.",
                "error",
              );
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
  } catch (error) {
    console.error("Error loading profile:", error);
    const headerContainer = document.getElementById("profileHeader");
    if (headerContainer) {
      headerContainer.innerHTML = `<p class='error-message'>${error.message || "Failed to load profile. Please try again."}</p>`;
    }
    showMessage(
      error.message || "Failed to load profile. Please try again.",
      "error",
    );
  }
}

function setupMobileNavigation() {
  const mobileSearchBtn = document.getElementById("mobileSearchBtn");
  const mobileSearchOverlay = document.getElementById("mobileSearchOverlay");
  const mobileSearchClose = document.getElementById("mobileSearchClose");
  const mobileSearchInput = document.getElementById("mobileSearchInput");
  const mobileSearchResults = document.getElementById("mobileSearchResults");

  if (mobileSearchBtn && mobileSearchOverlay) {
    mobileSearchBtn.addEventListener("click", () => {
      mobileSearchOverlay.classList.add("active");
      mobileSearchInput.focus();
    });

    mobileSearchClose.addEventListener("click", () => {
      mobileSearchOverlay.classList.remove("active");
      mobileSearchInput.value = "";
      mobileSearchResults.innerHTML = "";
    });

    let searchTimeout;
    mobileSearchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value;

      searchTimeout = setTimeout(async () => {
        try {
          if (!query.trim()) {
            mobileSearchResults.innerHTML = "";
            return;
          }

          mobileSearchResults.innerHTML = "<p>Searching...</p>";

          mobileSearchResults.innerHTML = "";

          const postsHeading = document.createElement("h3");
          postsHeading.textContent = "Posts";
          postsHeading.className = "search-section-heading";
          mobileSearchResults.appendChild(postsHeading);

          const postsContainer = document.createElement("div");
          postsContainer.className = "search-posts-section";
          mobileSearchResults.appendChild(postsContainer);

          const postResults = await searchPosts(query);
          const filteredPosts = postResults.filter(
            (post) => post.tags && post.tags.includes("Pulse2026"),
          );

          if (filteredPosts.length > 0) {
            generatePostsHTML(filteredPosts, postsContainer);
          } else {
            postsContainer.innerHTML =
              '<p class="no-results">No posts found</p>';
          }

          const profilesHeading = document.createElement("h3");
          profilesHeading.textContent = "Profiles";
          profilesHeading.className = "search-section-heading";
          mobileSearchResults.appendChild(profilesHeading);

          const profilesContainer = document.createElement("div");
          profilesContainer.className = "search-profiles-section";
          mobileSearchResults.appendChild(profilesContainer);

          const profileResults = await searchProfiles(query);

          if (profileResults.length > 0) {
            displayProfiles(profileResults, profilesContainer);
          } else {
            profilesContainer.innerHTML =
              '<p class="no-results">No profiles found</p>';
          }
        } catch (error) {
          console.error("Error during mobile search:", error);
          mobileSearchResults.innerHTML = `<p class='error-message'>${error.message || "Search failed. Please try again."}</p>`;
        }
      }, 300);
    });
  }

  const mobileCreateBtn = document.getElementById("mobileCreateBtn");
  const mobileCreateOverlay = document.getElementById("mobileCreateOverlay");
  const mobileCreateClose = document.getElementById("mobileCreateClose");
  const mobileCreateForm = document.getElementById("mobileCreateForm");

  if (mobileCreateBtn && mobileCreateOverlay) {
    mobileCreateBtn.addEventListener("click", () => {
      mobileCreateOverlay.classList.add("active");
    });

    mobileCreateClose.addEventListener("click", () => {
      mobileCreateOverlay.classList.remove("active");
      mobileCreateForm.reset();
    });

    mobileCreateForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        const title = document.getElementById("mobilePostTitle").value;
        const body = document.getElementById("mobilePostBody").value;
        const artist = document.getElementById("mobilePostArtist").value;
        const song = document.getElementById("mobilePostSong").value;
        const imageUrl = document.getElementById("mobilePostImageUrl").value;
        const imageAlt = document.getElementById("mobilePostImageAlt").value;

        if (!title.trim() || !body.trim() || !artist.trim() || !song.trim()) {
          showMessage(
            "Please fill in all required fields (title, body, artist, and song).",
            "error",
          );
          return;
        }

        const postData = {
          title: title.trim(),
          body: body.trim(),
          tags: ["Pulse2026", `artist:${artist.trim()}`, `song:${song.trim()}`],
        };

        if (imageUrl.trim()) {
          postData.media = {
            url: imageUrl.trim(),
            alt: imageAlt.trim() || "Post image",
          };
        }

        const result = await createPost(postData);
        if (result) {
          showMessage("Post created successfully!", "success");
          mobileCreateOverlay.classList.remove("active");
          mobileCreateForm.reset();
          if (displayContainer) {
            loadFeed();
          }
        }
      } catch (error) {
        console.error("Error creating post:", error);
        showMessage(
          error.message || "Failed to create post. Please try again.",
          "error",
        );
      }
    });
  }

  const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");
  const mobileLogoutOverlay = document.getElementById("mobileLogoutOverlay");
  const mobileLogoutCancel = document.getElementById("mobileLogoutCancel");

  if (mobileLogoutBtn && mobileLogoutOverlay) {
    mobileLogoutBtn.addEventListener("click", () => {
      mobileLogoutOverlay.classList.add("active");
    });

    mobileLogoutCancel.addEventListener("click", () => {
      mobileLogoutOverlay.classList.remove("active");
    });
  }
}

async function handleMobileSearch(query, searchType, container) {
  try {
    if (!container) {
      console.error("handleMobileSearch: container element not found");
      return;
    }

    if (searchType === "posts") {
      const results = await searchPosts(query);
      const filteredResults = results.filter(
        (post) => post.tags && post.tags.includes("Pulse2026"),
      );
      generatePostsHTML(filteredResults, container);
    } else if (searchType === "profiles") {
      const profiles = await searchProfiles(query);
      displayProfiles(profiles, container);
    }
  } catch (error) {
    console.error("Error during mobile search:", error);
    if (container) {
      container.innerHTML = `<p class='error-message'>${error.message || "Search failed. Please try again."}</p>`;
    }
  }
}

async function main() {
  try {
    if (!requireAuth()) return;

    if (displayContainer) {
      await loadFeed();
    }

    const profileHeader = document.getElementById("profileHeader");
    if (profileHeader) {
      await loadProfile();
    }

    setupMobileNavigation();

    const desktopSearchBtn = document.getElementById("desktopSearchBtn");
    const desktopHeader = document.querySelector(".desktop-header");
    const desktopSearchInput = document.getElementById("desktopSearchInput");
    const desktopSearchResults = document.getElementById(
      "desktopSearchResults",
    );

    if (desktopSearchBtn && desktopHeader) {
      desktopSearchBtn.addEventListener("click", () => {
        desktopHeader.classList.toggle("expanded");
        if (desktopHeader.classList.contains("expanded")) {
          desktopSearchInput.focus();
        } else {
          desktopSearchInput.value = "";
          desktopSearchResults.innerHTML = "";
        }
      });

      let searchTimeout;
      if (desktopSearchInput) {
        desktopSearchInput.addEventListener("input", (e) => {
          clearTimeout(searchTimeout);
          const query = e.target.value;

          searchTimeout = setTimeout(async () => {
            try {
              if (!query.trim()) {
                desktopSearchResults.innerHTML = "";
                return;
              }

              desktopSearchResults.innerHTML = "<p>Searching...</p>";

              desktopSearchResults.innerHTML = "";

              const postsHeading = document.createElement("h3");
              postsHeading.textContent = "Posts";
              postsHeading.className = "search-section-heading";
              desktopSearchResults.appendChild(postsHeading);

              const postsContainer = document.createElement("div");
              postsContainer.className = "search-posts-section";
              desktopSearchResults.appendChild(postsContainer);

              const postResults = await searchPosts(query);
              const filteredPosts = postResults.filter(
                (post) => post.tags && post.tags.includes("Pulse2026"),
              );

              if (filteredPosts.length > 0) {
                generatePostsHTML(filteredPosts, postsContainer);
              } else {
                postsContainer.innerHTML =
                  '<p class="no-results">No posts found</p>';
              }

              const profilesHeading = document.createElement("h3");
              profilesHeading.textContent = "Profiles";
              profilesHeading.className = "search-section-heading";
              desktopSearchResults.appendChild(profilesHeading);

              const profilesContainer = document.createElement("div");
              profilesContainer.className = "search-profiles-section";
              desktopSearchResults.appendChild(profilesContainer);

              const profileResults = await searchProfiles(query);
              if (profileResults.length > 0) {
                displayProfiles(profileResults, profilesContainer);
              } else {
                profilesContainer.innerHTML =
                  '<p class="no-results">No profiles found</p>';
              }
            } catch (error) {
              console.error("Error during desktop search:", error);
              desktopSearchResults.innerHTML = `<p class='error-message'>${error.message || "Search failed. Please try again."}</p>`;
            }
          }, 300);
        });
      }
    }

    const desktopCreateBtn = document.getElementById("desktopCreateBtn");
    if (desktopCreateBtn) {
      desktopCreateBtn.addEventListener("click", () => {
        openCreatePostModal(createPost, loadFeed);
      });
    }

    const desktopLogoutBtn = document.getElementById("desktopLogoutBtn");
    const mobileLogoutOverlay = document.getElementById("mobileLogoutOverlay");
    if (desktopLogoutBtn && mobileLogoutOverlay) {
      desktopLogoutBtn.addEventListener("click", () => {
        mobileLogoutOverlay.classList.add("active");
      });
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
      showDeleteConfirm(async () => {
        try {
          const result = await deletePost(e.detail.id);
          if (result) {
            showMessage("Post deleted successfully!", "success");

            if (displayContainer) {
              loadFeed();
            } else {
              window.location.href = "feed.html";
            }
          }
        } catch (error) {
          console.error("Error deleting post:", error);
          showMessage(
            error.message || "Failed to delete post. Please try again.",
            "error",
          );
        }
      });
    });

    const { getFromLocalStorage } = await import("./utils/storage.js");
    const user = getFromLocalStorage("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        const mobileAvatar = document.querySelector(".mobile-profile-avatar");
        const desktopAvatar = document.querySelector(
          ".desktop-icon[alt='Profile Icon']",
        );

        if (mobileAvatar && userData.avatar?.url) {
          mobileAvatar.src = userData.avatar.url;
          mobileAvatar.alt = userData.name;
        }
        if (desktopAvatar && userData.avatar?.url) {
          desktopAvatar.src = userData.avatar.url;
          desktopAvatar.alt = userData.name;
        }
      } catch (error) {
        console.error("Error parsing user data for avatar:", error);
      }
    }
  } catch (error) {
    console.error("Error in main initialization:", error);
    showMessage(
      "An error occurred while loading the page. Please refresh and try again.",
      "error",
    );
  }
}

main();
