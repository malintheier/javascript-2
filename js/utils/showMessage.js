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
