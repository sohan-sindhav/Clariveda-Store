import { createContext, useContext, useState, useEffect } from "react";
import { axiosInstance, AUTH_ENDPOINTS } from "../api/authConfig";
import { Children } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(AUTH_ENDPOINTS.me);
        setUser(res.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const register = async (data) => {
    setAuthLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axiosInstance.post(AUTH_ENDPOINTS.register, data);
      setUser(res.data.user);
      setMessage({
        type: "success",
        text: res.data.message || "Registered Successfully!",
      });

      setTimeout(async () => {
        const meRes = await axiosInstance.get(AUTH_ENDPOINTS.me);
        setUser(meRes.data.user);
      }, 200);

      return res.data.user;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Registration failed. please try again.";
      setMessage({ type: "error", text: msg });
      throw error; // ← FIXED: Changed 'err' to 'error'
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (data) => {
    setAuthLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axiosInstance.post(AUTH_ENDPOINTS.login, data);
      setMessage({
        type: "success",
        text: res.data.message || "Logged in successfully!",
      });

      // wait a moment to ensure cookie sync
      await new Promise((resolve) => setTimeout(resolve, 200));

      // fetch user from /me again (so React gets the user with cookie-based session)
      const meRes = await axiosInstance.get(AUTH_ENDPOINTS.me);
      setUser(meRes.data.user);

      return meRes.data.user;
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      setMessage({ type: "error", text: msg });
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  //logout

  const logout = async () => {
    try {
      await axiosInstance.post(AUTH_ENDPOINTS.logout);
      setUser(null);
      setMessage({ type: "success", text: "Logged out successfully!" });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authLoading,
        message,
        login,
        register,
        logout,
        setUser,
        setMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
