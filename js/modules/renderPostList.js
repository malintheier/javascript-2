export function generatePostsHTML(posts, displayContainer) {
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
