import api from "../util/api.util.js";  
import { toast } from "react-hot-toast";

const verifyRole = async (setIsAdmin, navigate) => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Unauthorized access. Redirecting...");
    setTimeout(() => navigate('/'), 2000);
    return;
  }

  try {
    const res = await api.get("/api/verify-role", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.role === "admin" || res.data.role === "superadmin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      toast.error("Unauthorized access. Redirecting...");
      setTimeout(() => navigate('/'), 2000);
    }
  } catch (error) {
    console.error("Role verification error:", error);
    setIsAdmin(false);
    toast.error("Unauthorized access. Redirecting...");
    setTimeout(() => navigate('/'), 2000);
  }
};

export default verifyRole;
