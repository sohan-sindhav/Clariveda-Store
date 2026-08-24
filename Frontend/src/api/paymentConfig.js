import axios from "axios";
import { BACKEND_URL } from "../config/env";

export const axiosPayment = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const PAYMENT_ENDPOINTS = {
  verify: "/api/payments/verify",
};
