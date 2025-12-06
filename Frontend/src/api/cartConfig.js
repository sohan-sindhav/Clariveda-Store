import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

// Create axios instance for cart-related requests
export const axiosCart = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // to send cookies / JWT for authenticated users
});

// Define all cart endpoints in one place
export const CART_ENDPOINTS = {
  add: "/api/cart/add", // POST — add product to cart
  remove: "/api/cart/remove", // POST — remove specific product
  clear: "/api/cart/clear", // POST — clear all products from user’s cart
  get: "/api/cart/", // GET — fetch current user's cart
  updateQuantity: "/api/cart/update", // POST — change quantity of a product
  sync: "/api/cart/sync", // POST — change quantity of a product
};
