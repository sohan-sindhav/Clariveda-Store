import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaUser, FaEnvelope, FaBox, FaSignOutAlt, FaShieldAlt } from "react-icons/fa";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center max-w-sm w-full">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
            <FaUser size={20} />
          </div>
          <h2 className="text-base font-semibold text-gray-800 mb-1">Not Signed In</h2>
          <p className="text-xs text-gray-500 mb-4">Please sign in to access your profile.</p>
          <Link
            to="/login"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-md shadow-sm transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 pb-3 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">User Account</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage your profile details and orders</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-2xl border-2 border-emerald-200">
              {user.username ? user.username[0].toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">{user.username || "User"}</h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-gray-100 text-gray-700 border border-gray-200">
                  {user.role || "user"}
                </span>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <FaEnvelope size={11} />
                <span>{user.email}</span>
              </p>
            </div>
          </div>

          <div className="py-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              <span className="text-gray-400 block mb-1">Username</span>
              <span className="font-semibold text-gray-800 text-sm">{user.username || "-"}</span>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              <span className="text-gray-400 block mb-1">Registered Email</span>
              <span className="font-semibold text-gray-800 text-sm">{user.email || "-"}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/myOrders")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md shadow-sm transition"
            >
              <FaBox size={12} className="text-emerald-600" />
              <span>View Order History</span>
            </button>

            {user.role === "admin" && (
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 px-4 py-2 rounded-md transition"
              >
                <FaShieldAlt size={12} />
                <span>Admin Dashboard</span>
              </button>
            )}

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 px-4 py-2 rounded-md transition ml-auto"
            >
              <FaSignOutAlt size={12} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
