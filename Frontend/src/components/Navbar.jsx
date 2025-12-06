import React from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaLeaf, FaUser } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const cartCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <nav className="bg-gradient-to-r from-amber-700 to-green-800 text-white shadow-lg relative">
      {/* Main Navbar Content */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand Logo */}
        <div
          onClick={() => navigate("/dashboard")}
          className="flex items-center space-x-3 cursor-pointer group flex-shrink-0"
        >
          <div className="relative">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FaLeaf className="text-amber-700 text-lg" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-100 to-green-100 bg-clip-text text-transparent leading-tight">
              Clariveda
            </h1>
            <p className="text-xs text-amber-200 opacity-80 group-hover:opacity-100 transition-opacity duration-300 leading-tight">
              Ayurvedic Wellness
            </p>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4 lg:space-x-6 ml-4">
          {/* Cart with Ayurvedic styling */}
          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer group flex-shrink-0"
          >
            <div className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
              <FaShoppingCart className="text-amber-100" size={18} />
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-400 text-white text-xs font-bold px-1.5 py-0.5 rounded-full border-2 border-amber-700 shadow-lg min-w-[20px] text-center">
                {cartCount}
              </span>
            )}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-amber-200 group-hover:w-full transition-all duration-300"></div>
          </div>

          {/* Auth Info */}
          {user ? (
            <div className="flex items-center space-x-3 lg:space-x-4">
              {/* User Profile */}
              <Link
                to="/userProfile"
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 lg:px-4 lg:py-2 rounded-lg transition-all duration-300 group flex-shrink-0"
              >
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaUser className="text-amber-700 text-sm" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-amber-100 font-medium text-sm leading-tight">
                    {user.username || "User"}
                  </p>
                  <p className="text-amber-200 text-xs opacity-80 group-hover:opacity-100 transition-opacity duration-300 leading-tight">
                    Your Profile
                  </p>
                </div>
              </Link>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-3 py-2 lg:px-4 lg:py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-amber-400/30 flex-shrink-0 whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <span className="text-amber-200 italic text-sm bg-white/10 px-3 py-1 rounded-full hidden md:block flex-shrink-0">
                Welcome to Ayurveda
              </span>
              <Link
                to="/login"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 flex-shrink-0 whitespace-nowrap"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Subtle decorative bottom border - removed the thick line */}
      <div className="h-0.5 bg-gradient-to-r from-amber-400 via-green-400 to-amber-400 opacity-30"></div>
    </nav>
  );
};

export default Navbar;
