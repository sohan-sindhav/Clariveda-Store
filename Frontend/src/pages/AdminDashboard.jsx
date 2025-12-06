import React from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Package, Users } from "lucide-react";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-12">
      <Navbar />
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-11/12 max-w-4xl">
        {/* Create New Product */}
        <div
          onClick={() => navigate("/product/upload")}
          className="bg-gray-800 hover:bg-gray-700 transition-all p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer shadow-lg"
        >
          <PlusCircle size={40} className="text-indigo-400 mb-3" />
          <h2 className="text-xl font-semibold mb-1">Create New Product</h2>
          <p className="text-gray-400 text-sm text-center">
            Upload a new product with image and details
          </p>
        </div>

        {/* View All Products */}
        <div
          onClick={() => navigate("/products")}
          className="bg-gray-800 hover:bg-gray-700 transition-all p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer shadow-lg"
        >
          <Package size={40} className="text-green-400 mb-3" />
          <h2 className="text-xl font-semibold mb-1">View All Products</h2>
          <p className="text-gray-400 text-sm text-center">
            Manage, edit, or delete existing products
          </p>
        </div>

        {/* Manage Users */}
        <div
          onClick={() => navigate("/admin/users")}
          className="bg-gray-800 hover:bg-gray-700 transition-all p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer shadow-lg"
        >
          <Users size={40} className="text-pink-400 mb-3" />
          <h2 className="text-xl font-semibold mb-1">Manage Users</h2>
          <p className="text-gray-400 text-sm text-center">
            View and manage registered users
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
