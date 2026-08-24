import React from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaLeaf, FaUser, FaBox, FaPlusCircle } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <FaLeaf size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-lg leading-tight">
              Clariveda
            </span>
            <span className="text-[10px] text-emerald-700 font-medium tracking-wide uppercase">
              Ayurvedic Store
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-4">
          <Link
            to="/dashboard"
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
              location.pathname === "/dashboard"
                ? "text-emerald-700 bg-emerald-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Products
          </Link>

          {user && (
            <Link
              to="/myOrders"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition ${
                location.pathname === "/myOrders"
                  ? "text-emerald-700 bg-emerald-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <FaBox size={13} />
              <span>Orders</span>
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition ${
                location.pathname.startsWith("/admin") || location.pathname === "/product/upload"
                  ? "text-purple-700 bg-purple-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <FaPlusCircle size={13} />
              <span>Admin</span>
            </Link>
          )}

          <Link
            to="/cart"
            className="relative p-2 text-gray-700 hover:text-emerald-600 hover:bg-gray-100 rounded-md transition"
            title="Cart"
          >
            <FaShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <Link
                to="/userProfile"
                className="flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-50 text-gray-700"
                title="Profile"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-semibold text-xs">
                  {user.username ? user.username[0].toUpperCase() : <FaUser size={12} />}
                </div>
                <span className="text-sm font-medium text-gray-800 hidden md:inline">
                  {user.username}
                </span>
              </Link>
              <button
                onClick={logout}
                className="text-xs font-medium text-gray-600 hover:text-red-600 border border-gray-300 hover:border-red-200 hover:bg-red-50 px-2.5 py-1.5 rounded-md transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-md shadow-sm transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
