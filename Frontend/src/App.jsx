import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./pages/userProfile";
import ProductUploadForm from "./pages/ProductUploadForm";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import CartPage from "./pages/CartPage";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/myOrders" element={<MyOrders />} />
        <Route path="/order/:id" element={<OrderDetails />} />
      </Route>

      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/product/upload"
        element={
          <AdminProtectedRoute>
            <ProductUploadForm />
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
