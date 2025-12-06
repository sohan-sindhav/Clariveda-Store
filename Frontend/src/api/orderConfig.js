import axios from "axios";

export const axiosOrder = axios.create({
  baseURL: "https://clariveda-store.onrender.com:5000/api/orders",
  withCredentials: true,
});

export const ORDER_ENDPOINTS = {
  create: "/create",
  myOrders: "/my-orders",
  getById: (id) => `/${id}`,
};
