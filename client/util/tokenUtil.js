import jwtDecode from "jwt-decode";

export function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded._id;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}
