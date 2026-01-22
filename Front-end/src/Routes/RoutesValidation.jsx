import { Navigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

const ProtectedRoute = () => {
  const token = localStorage.getItem("userId");

  if (!token) {
    toast.error("Please login first");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;