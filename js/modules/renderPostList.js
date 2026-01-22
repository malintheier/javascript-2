import { renderPostCard } from "./renderPostCard.js";

export function generatePostsHTML(posts, displayContainer) {
  displayContainer.innerHTML = "";

  for (let i = 0; i < posts.length; i++) {
    const postCard = renderPostCard(posts[i], false);
    displayContainer.append(postCard);
  }
}
