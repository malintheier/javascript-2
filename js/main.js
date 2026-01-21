import { fetchPosts } from "./api/posts.js";
import { generatePostsHTML } from "./modules/renderPostList.js";
import { requireAuth } from "./utils/authGuard.js";

const displayContainer = document.getElementById("displayContainer");

async function main() {
  if (!requireAuth()) return;

  const posts = await fetchPosts();

  // Filter posts to only show those with "Pulse2026" tag
  const filteredPosts = posts.filter(
    (post) => post.tags && post.tags.includes("Pulse2026"),
  );

  generatePostsHTML(filteredPosts, displayContainer);
}

main();
