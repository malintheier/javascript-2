import { fetchPosts } from "./api/posts.js";
import { generatePostsHTML } from "./modules/renderPostList.js";
import { requireAuth } from "./utils/authGuard.js";

const displayContainer = document.getElementById("displayContainer");

async function main() {
  if (!requireAuth()) return;

  const posts = await fetchPosts();
  generatePostsHTML(posts, displayContainer);
}

main();
