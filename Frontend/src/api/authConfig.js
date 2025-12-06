import axios from "axios";

const API_BASE_URL = "https://clariveda-store.onrender.com:5000";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const AUTH_ENDPOINTS = {
  register: "/api/auth/register",
  login: "/api/auth/login",
  logout: "/api/auth/logout",
  me: "/api/auth/profile",
};
