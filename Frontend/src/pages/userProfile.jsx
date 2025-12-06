import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  FaLeaf,
  FaUser,
  FaEnvelope,
  FaSignOutAlt,
  FaHeart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUser className="text-amber-600 text-2xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No User Found
          </h2>
          <p className="text-gray-600">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center shadow-lg">
              <FaLeaf className="text-amber-700 text-3xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-green-700">
              Wellness
            </span>{" "}
            Profile
          </h1>
          <p className="text-gray-600">Your Ayurvedic journey with Clariveda</p>

          {/* Decorative Elements */}
          <div className="flex justify-center mt-4">
            <div className="w-12 h-1 bg-amber-500 rounded-full mx-1"></div>
            <div className="w-4 h-4 bg-green-500 rounded-full mx-1 mt-2"></div>
            <div className="w-12 h-1 bg-amber-500 rounded-full mx-1"></div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100">
          <div className="p-8">
            {/* User Avatar */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-amber-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                <FaUser className="text-white text-3xl" />
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-6">
              {/* Name Field */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-amber-600 text-sm" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-amber-600 font-medium">
                      Full Name
                    </p>
                    <p className="text-gray-800 font-semibold">
                      {user.name || user.username || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FaEnvelope className="text-green-600 text-sm" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-green-600 font-medium">
                      Email Address
                    </p>
                    <p className="text-gray-800 font-semibold">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Wellness Status */}
              <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100 text-center">
                <div className="flex items-center justify-center space-x-2 text-amber-700">
                  <FaHeart className="text-amber-500" />
                  <span className="text-sm font-medium">
                    Active Wellness Member
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Thank you for choosing natural Ayurvedic care
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => navigate("/myOrders")}
              className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
             text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform 
             hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>My Orders</span>
            </button>
            <button
              onClick={logout}
              className="w-full mt-8 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <FaSignOutAlt className="text-sm" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Your natural wellness journey matters to us
          </p>
        </div>

        {/* Background Decorative Elements */}
        <div className="fixed top-10 left-10 w-20 h-20 bg-amber-200 rounded-full opacity-20 blur-xl -z-10"></div>
        <div className="fixed bottom-10 right-10 w-24 h-24 bg-green-200 rounded-full opacity-20 blur-xl -z-10"></div>
        <div className="fixed top-1/3 right-1/4 w-16 h-16 bg-amber-300 rounded-full opacity-15 blur-lg -z-10"></div>
      </div>
    </div>
  );
};

export default UserProfile;
