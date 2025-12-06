import axios from "axios";

export const axiosOrder = axios.create({
  baseURL: "http://localhost:5000/api/orders",
  withCredentials: true,
});

export const ORDER_ENDPOINTS = {
  create: "/create",
  myOrders: "/my-orders",
  getById: (id) => `/${id}`,
};
