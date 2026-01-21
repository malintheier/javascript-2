import { getFromLocalStorage } from "../utils/storage.js";
import { SOCIAL_URL, NOROFF_API_KEY } from "./config.js";

export async function fetchPosts() {
  try {
    const accessToken = getFromLocalStorage("accessToken");
    const fetchOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY,
      },
    };
    const response = await fetch(`${SOCIAL_URL}/posts`, fetchOptions);
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.log(error);
  }
}
