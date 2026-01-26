export function showModal(title, content) {
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
}

export function showMessage(message, type = "info") {
  const messageEl = document.createElement("div");
  messageEl.className = `message message-${type}`;
  messageEl.textContent = message;
  document.body.append(messageEl);

  setTimeout(() => messageEl.remove(), 3000);
}

export function openCreatePostModal(createPostCallback, loadFeedCallback) {
  const formHTML = `
    <form id="createPostForm" class="post-form">
      <label for="title">Title:</label>
      <input type="text" id="title" name="title" required class="form-input" />
      
      <label for="body">Body: <span id="createCharCount" class="char-count">0/280</span></label>
      <textarea id="body" name="body" required class="form-textarea" maxlength="280"></textarea>
      
      <label for="mediaUrl">Media URL (optional):</label>
      <input type="url" id="mediaUrl" name="mediaUrl" class="form-input" />
      
      <label for="mediaAlt">Media Alt Text (optional):</label>
      <input type="text" id="mediaAlt" name="mediaAlt" class="form-input" />
      
      <button type="submit" class="btn btn-primary">Create Post</button>
    </form>
  `;

  const modal = showModal("Create New Post", formHTML);

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
    };

    const mediaUrl = formData.get("mediaUrl");
    if (mediaUrl) {
      postData.media = {
        url: mediaUrl,
        alt: formData.get("mediaAlt") || "",
      };
    }

    const result = await createPostCallback(postData);

    if (result) {
      showMessage("Post created successfully!", "success");
      modal.remove();
      loadFeedCallback();
    } else {
      showMessage("Failed to create post", "error");
    }
  });
}

export function openEditPostModal(post, updatePostCallback, onSuccessCallback) {
  const formHTML = `
    <form id="editPostForm" class="post-form">
      <label for="editTitle">Title:</label>
      <input type="text" id="editTitle" name="title" required class="form-input" value="${post.title}" />
      
      <label for="editBody">Body: <span id="editCharCount" class="char-count">0/280</span></label>
      <textarea id="editBody" name="body" required class="form-textarea" maxlength="280">${post.body}</textarea>
      
      <label for="editMediaUrl">Media URL (optional):</label>
      <input type="url" id="editMediaUrl" name="mediaUrl" class="form-input" value="${post.media?.url || ""}" />
      
      <label for="editMediaAlt">Media Alt Text (optional):</label>
      <input type="text" id="editMediaAlt" name="mediaAlt" class="form-input" value="${post.media?.alt || ""}" />
      
      <button type="submit" class="btn btn-primary">Update Post</button>
    </form>
  `;

  const modal = showModal("Edit Post", formHTML);

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
      } else {
        showMessage("Failed to update post", "error");
      }
    } catch (error) {
      showMessage(error.message || "Failed to update post", "error");
    }
  });
}
