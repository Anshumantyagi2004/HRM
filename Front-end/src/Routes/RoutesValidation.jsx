import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const toastShown = useRef(false);

  useEffect(() => {
    if (!loading && !isAuthenticated && !toastShown.current) {
      toast.error("Please login first");
      toastShown.current = true;
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return <div className="text-center mt-10">Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
