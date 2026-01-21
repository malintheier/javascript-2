import { getFromLocalStorage } from "./utils-temporary.js";

const displayContainer = document.getElementById("displayContainer");

const BASE_API_URL = "https://v2.api.noroff.dev";
const POSTS_URL = `${BASE_API_URL}/social/posts`;

const NOROFF_API_KEY = "95f3d21d-f64e-4e95-ac99-ff1fe58006a3";

async function fetchPosts() {
  try {
    const accessToken = getFromLocalStorage("accessToken");
    const fetchOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY,
      },
    };
    const response = await fetch(POSTS_URL, fetchOptions);
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.log(error);
  }
}

function generatePostsHTML(posts) {
  for (let i = 0; i < posts.length; i++) {
    const postContainer = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = posts[i].title;
    const body = document.createElement("p");
    body.textContent = posts[i].body;
    const author = document.createElement("p");
    author.textContent = `Author: ${posts[i].author?.name || "Unknown"}`;
    const image = document.createElement("img");
    image.src = posts[i].image?.url || "";
    image.alt = posts[i].image?.alt || "";
    postContainer.append(title, body, author, image);
    displayContainer.append(postContainer);
  }
}

async function main() {
  const posts = await fetchPosts();
  generatePostsHTML(posts);
}
main();
