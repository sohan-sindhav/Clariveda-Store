import axios from "axios";
import { BACKEND_URL } from "../config/env";

export const axiosOrder = axios.create({
  baseURL: `${BACKEND_URL}/api/orders`,
  withCredentials: true,
});

export const ORDER_ENDPOINTS = {
  create: "/create",
  myOrders: "/my-orders",
  getById: (id) => `/${id}`,
  adminAll: "/admin/all",
  adminUpdateStatus: (id) => `/admin/${id}/status`,
};
