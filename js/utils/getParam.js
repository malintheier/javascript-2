export function getParam(paramName) {
  try {
    if (!paramName) {
      console.error("getParam: parameter name is required");
      return null;
    }

    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
  } catch (error) {
    console.error("Error getting URL parameter:", error);
    return null;
  }
}
