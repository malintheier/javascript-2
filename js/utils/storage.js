export function addToLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

export function getFromLocalStorage(key) {
  return localStorage.getItem(key);
}

export function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function removeUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
}
