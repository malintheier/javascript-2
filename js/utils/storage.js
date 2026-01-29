export function addToLocalStorage(key, value) {
  try {
    if (!key) {
      console.error("addToLocalStorage: key is required");
      return false;
    }

    if (value === undefined || value === null) {
      console.error("addToLocalStorage: value cannot be undefined or null");
      return false;
    }

    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error("Error saving to local storage:", error);
    if (error.name === 'QuotaExceededError') {
      alert("Storage quota exceeded. Please clear some browser data and try again.");
    } else {
      alert("Unable to save data. Please check your browser settings.");
    }
    return false;
  }
}

export function getFromLocalStorage(key) {
  try {
    if (!key) {
      console.error("getFromLocalStorage: key is required");
      return null;
    }

    return localStorage.getItem(key);
  } catch (error) {
    console.error("Error reading from local storage:", error);
    return null;
  }
}

export function saveUser(user) {
  try {
    if (!user) {
      console.error("saveUser: user data is required");
      return false;
    }

    if (!user.name && !user.email) {
      console.error("saveUser: user must have at least name or email");
      return false;
    }

    localStorage.setItem("user", JSON.stringify(user));
    return true;
  } catch (error) {
    console.error("Error saving user to local storage:", error);
    if (error.name === 'QuotaExceededError') {
      alert("Storage quota exceeded. Please clear some browser data and try again.");
    } else {
      alert("Unable to save user data. Please check your browser settings.");
    }
    return false;
  }
}

export function getUser() {
  try {
    const user = localStorage.getItem("user");
    if (!user) {
      return null;
    }
    return JSON.parse(user);
  } catch (error) {
    console.error("Error getting user from local storage:", error);
    if (error instanceof SyntaxError) {
      console.error("User data is corrupted. Clearing user data.");
      localStorage.removeItem("user");
    }
    return null;
  }
}

export function removeUser() {
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    return true;
  } catch (error) {
    console.error("Error removing user from local storage:", error);
    return false;
  }
}
