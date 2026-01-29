export function showModal(title, content) {
  try {
    if (!title) {
      console.error("showModal: title is required");
      title = "Information";
    }

    if (!content) {
      console.error("showModal: content is required");
      content = "<p>No content provided</p>";
    }

    const modal = document.createElement("div");
    modal.className = "modal";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modalContent.innerHTML = `
    <span class="modal-close">&times;</span>
    <h2>${title}</h2>
    ${content}
  `;

    modal.append(modalContent);
    document.body.append(modal);

    const closeBtn = modalContent.querySelector(".modal-close");
    closeBtn.addEventListener("click", () => modal.remove());

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });

    return modal;
  } catch (error) {
    console.error("Error showing modal:", error);
    alert("Unable to display modal. Please try again.");
    return null;
  }
}

export function showMessage(message, type = "info") {
  try {
    if (!message) {
      console.error("showMessage: message is required");
      return;
    }

    const validTypes = ["info", "success", "error", "warning"];
    if (!validTypes.includes(type)) {
      console.warn(`showMessage: invalid type '${type}', defaulting to 'info'`);
      type = "info";
    }

    const messageEl = document.createElement("div");
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    document.body.append(messageEl);

    setTimeout(() => messageEl.remove(), 3000);
  } catch (error) {
    console.error("Error showing message:", error);
  }
}

export function openCreatePostModal(createPostCallback, loadFeedCallback) {
  try {
    if (!createPostCallback || typeof createPostCallback !== 'function') {
      console.error("openCreatePostModal: createPostCallback must be a function");
      showMessage("Unable to open create post form. Please try again.", "error");
      return;
    }

    if (!loadFeedCallback || typeof loadFeedCallback !== 'function') {
      console.error("openCreatePostModal: loadFeedCallback must be a function");
      showMessage("Unable to open create post form. Please try again.", "error");
      return;
    }

    const formHTML = `
    <form id="createPostForm" class="post-form">
      <label for="song">Song:</label>
      <input type="text" id="song" name="song" required class="form-input" />
      
      <label for="artist">Artist:</label>
      <input type="text" id="artist" name="artist" required class="form-input" />
      
      <label for="title">Title:</label>
      <input type="text" id="title" name="title" required class="form-input" />
      
      <label for="body">Body: <span id="createCharCount" class="char-count">0/280</span></label>
      <textarea id="body" name="body" required class="form-textarea" maxlength="280"></textarea>
      
      <label for="mediaUrl">Album cover URL (optional):</label>
      <input type="url" id="mediaUrl" name="mediaUrl" class="form-input" />
      
      <label for="mediaAlt">Media Alt Text (optional):</label>
      <input type="text" id="mediaAlt" name="mediaAlt" class="form-input" />
      
      <button type="submit" class="btn btn-primary">Create Post</button>
    </form>
  `;

    const modal = showModal("Create New Post", formHTML);

    if (!modal) {
      showMessage("Unable to open create post form. Please try again.", "error");
      return;
    }

    const form = modal.querySelector("#createPostForm");
    const bodyTextarea = form.querySelector("#body");
    const charCount = modal.querySelector("#createCharCount");

  bodyTextarea.addEventListener("input", () => {
    const length = bodyTextarea.value.length;
    charCount.textContent = `${length}/280`;
    charCount.style.color = length > 280 ? "red" : "";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const body = formData.get("body");

    if (body.length > 280) {
      showMessage("Body cannot be greater than 280 characters", "error");
      return;
    }

    const postData = {
      title: formData.get("title"),
      body: body,
      tags: [
        "Pulse2026",
        `artist:${formData.get("artist")}`,
        `song:${formData.get("song")}`,
      ],
    };

    const mediaUrl = formData.get("mediaUrl");
    if (mediaUrl) {
      postData.media = {
        url: mediaUrl,
        alt: formData.get("mediaAlt") || "",
      };
    }

    try {
      const result = await createPostCallback(postData);

      if (result) {
        showMessage("Post created successfully!", "success");
        modal.remove();
        loadFeedCallback();
      }
    } catch (error) {
      console.error("Create post error:", error);
      showMessage(error.message || "Failed to create post. Please try again.", "error");
    }
  });
  } catch (error) {
    console.error("Error opening create post modal:", error);
    showMessage("Unable to open create post form. Please try again.", "error");
  }
}

export function openEditPostModal(post, updatePostCallback, onSuccessCallback) {
  try {
    if (!post || !post.id) {
      console.error("openEditPostModal: valid post with id is required");
      showMessage("Unable to edit post: post data is missing.", "error");
      return;
    }

    if (!updatePostCallback || typeof updatePostCallback !== 'function') {
      console.error("openEditPostModal: updatePostCallback must be a function");
      showMessage("Unable to open edit form. Please try again.", "error");
      return;
    }

    if (!onSuccessCallback || typeof onSuccessCallback !== 'function') {
      console.error("openEditPostModal: onSuccessCallback must be a function");
      showMessage("Unable to open edit form. Please try again.", "error");
      return;
    }

    const artistTag = post.tags?.find((tag) => tag.startsWith("artist:"));
    const songTag = post.tags?.find((tag) => tag.startsWith("song:"));
    const artist = artistTag ? artistTag.replace("artist:", "") : "";
    const song = songTag ? songTag.replace("song:", "") : "";

  const formHTML = `
    <form id="editPostForm" class="post-form">
      <label for="editSong">Song:</label>
      <input type="text" id="editSong" name="song" required class="form-input" value="${song}" />
      
      <label for="editArtist">Artist:</label>
      <input type="text" id="editArtist" name="artist" required class="form-input" value="${artist}" />
      
      <label for="editTitle">Title:</label>
      <input type="text" id="editTitle" name="title" required class="form-input" value="${post.title}" />
      
      <label for="editBody">Body: <span id="editCharCount" class="char-count">0/280</span></label>
      <textarea id="editBody" name="body" required class="form-textarea" maxlength="280">${post.body}</textarea>
      
      <label for="editMediaUrl">Album cover URL (optional):</label>
      <input type="url" id="editMediaUrl" name="mediaUrl" class="form-input" value="${post.media?.url || ""}" />
      
      <label for="editMediaAlt">Media Alt Text (optional):</label>
      <input type="text" id="editMediaAlt" name="mediaAlt" class="form-input" value="${post.media?.alt || ""}" />
      
      <button type="submit" class="btn btn-primary">Update Post</button>
    </form>
  `;

  const modal = showModal("Edit Post", formHTML);

  if (!modal) {
    showMessage("Unable to open edit form. Please try again.", "error");
    return;
  }

  const form = modal.querySelector("#editPostForm");
  const bodyTextarea = form.querySelector("#editBody");
  const charCount = modal.querySelector("#editCharCount");

  charCount.textContent = `${bodyTextarea.value.length}/280`;

  bodyTextarea.addEventListener("input", () => {
    const length = bodyTextarea.value.length;
    charCount.textContent = `${length}/280`;
    charCount.style.color = length > 280 ? "red" : "";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const body = formData.get("body");

    if (body.length > 280) {
      showMessage("Body cannot be greater than 280 characters", "error");
      return;
    }

    const postData = {
      title: formData.get("title"),
      body: body,
      tags: [
        "Pulse2026",
        `artist:${formData.get("artist")}`,
        `song:${formData.get("song")}`,
      ],
    };

    const mediaUrl = formData.get("mediaUrl");
    if (mediaUrl) {
      postData.media = {
        url: mediaUrl,
        alt: formData.get("mediaAlt") || "",
      };
    }

    try {
      const result = await updatePostCallback(post.id, postData);

      if (result) {
        showMessage("Post updated successfully!", "success");
        modal.remove();
        onSuccessCallback();
      }
    } catch (error) {
      console.error("Update post error:", error);
      showMessage(error.message || "Failed to update post. Please try again.", "error");
    }
  });
  } catch (error) {
    console.error("Error opening edit post modal:", error);
    showMessage("Unable to open edit form. Please try again.", "error");
  }
}

export function showDeleteConfirm(onConfirm) {
  try {
    if (!onConfirm || typeof onConfirm !== 'function') {
      console.error("showDeleteConfirm: onConfirm callback must be a function");
      showMessage("Unable to show delete confirmation. Please try again.", "error");
      return;
    }

    const overlay = document.createElement("div");
    overlay.className = "mobile-logout-overlay active";

  const dialog = document.createElement("div");
  dialog.className = "mobile-logout-dialog";
  dialog.innerHTML = `
    <p>Are you sure you want to delete this post?</p>
    <button class="mobile-logout-confirm" id="confirmDelete">Yes, delete</button>
    <button class="mobile-logout-cancel" id="cancelDelete">Cancel</button>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const confirmBtn = dialog.querySelector("#confirmDelete");
  const cancelBtn = dialog.querySelector("#cancelDelete");

  confirmBtn.addEventListener("click", () => {
    overlay.remove();
    onConfirm();
  });

  cancelBtn.addEventListener("click", () => {
    overlay.remove();
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
  } catch (error) {
    console.error("Error showing delete confirmation:", error);
    showMessage("Unable to show delete confirmation. Please try again.", "error");
  }
}
