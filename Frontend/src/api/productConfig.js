import axios from "axios";

const API_BASE_URL = "https://clariveda-store.onrender.com:5000";

export const axiosProduct = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ensures cookies (JWT) are sent with requests
});

export const PRODUCT_ENDPOINTS = {
  upload: "/api/products/create", // ✅ match your route name
  all: "/api/products/all",
  delete: (id) => `/api/products/${id}`, // ✅ make it a function for dynamic IDs
};
