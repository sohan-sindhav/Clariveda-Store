// src/routes/AdminProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Wait until user data is loaded
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        <p>Checking admin access...</p>
      </div>
    );
  }

  // If no user or not admin → redirect
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // If admin → render protected page
  return children;
};

export default AdminProtectedRoute;
