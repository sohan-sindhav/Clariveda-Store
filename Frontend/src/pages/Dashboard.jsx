import React from "react";
import Navbar from "../components/Navbar";
import ProductList from "../components/ProductList";
import { FaShieldAlt, FaTruck, FaLeaf, FaUndo } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="bg-emerald-700 text-white py-10 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl">
              <span className="inline-block bg-emerald-800 text-emerald-200 text-xs font-semibold px-2.5 py-1 rounded mb-3">
                100% Herbal & Natural
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                Clariveda Ayurvedic Store
              </h1>
              <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
                Discover authentic Ayurvedic skincare, wellness formulations, and natural daily essentials prepared with traditional herbs.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-700">
            <div className="flex items-center gap-2.5">
              <FaLeaf className="text-emerald-600 flex-shrink-0" size={16} />
              <div>
                <p className="font-semibold text-gray-900">Pure Herbs</p>
                <p className="text-gray-500">Chemical-free formulas</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <FaTruck className="text-emerald-600 flex-shrink-0" size={16} />
              <div>
                <p className="font-semibold text-gray-900">Free Delivery</p>
                <p className="text-gray-500">On all orders</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <FaShieldAlt className="text-emerald-600 flex-shrink-0" size={16} />
              <div>
                <p className="font-semibold text-gray-900">Quality Assured</p>
                <p className="text-gray-500">Authentic ingredients</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <FaUndo className="text-emerald-600 flex-shrink-0" size={16} />
              <div>
                <p className="font-semibold text-gray-900">Cash on Delivery</p>
                <p className="text-gray-500">Pay at your doorstep</p>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Available Products</h2>
          </div>
          <ProductList />
        </main>
      </div>

      <footer className="bg-white border-t border-gray-200 py-6 mt-12 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Clariveda Store — Ayurvedic Skincare & Wellness Project</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
