import { fetchPosts } from "./api/posts.js";
import { generatePostsHTML } from "./modules/renderPostList.js";

const displayContainer = document.getElementById("displayContainer");

async function main() {
  const posts = await fetchPosts();
  generatePostsHTML(posts, displayContainer);
}

main();
