import axios from "axios";
import { BACKEND_URL } from "../config/env";

export const axiosProduct = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

export const PRODUCT_ENDPOINTS = {
  upload: "/api/products/create",
  all: "/api/products/all",
  getById: (id) => `/api/products/${id}`,
  update: (id) => `/api/products/${id}`,
  delete: (id) => `/api/products/${id}`,
};
