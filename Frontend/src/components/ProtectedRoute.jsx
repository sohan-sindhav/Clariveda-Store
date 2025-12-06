import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Checking session...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />; // 👈 This renders nested routes
};

export default ProtectedRoute;
