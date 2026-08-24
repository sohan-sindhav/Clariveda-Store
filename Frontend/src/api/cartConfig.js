import axios from "axios";
import { BACKEND_URL } from "../config/env";

export const axiosCart = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

export const CART_ENDPOINTS = {
  add: "/api/cart/add",
  remove: "/api/cart/remove",
  clear: "/api/cart/clear",
  get: "/api/cart/",
  updateQuantity: "/api/cart/update",
  sync: "/api/cart/sync",
};
