import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaLeaf, FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const { login, authLoading, message, user } = useAuth();
  const navigate = useNavigate();

  // Auto redirect if user is already logged in
  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loggedInUser = await login(formData);
      // If backend returned user, navigate immediately.
      if (loggedInUser) {
        // slight delay to ensure cookie is written by browser (optional)
        setTimeout(() => {
          if (loggedInUser.role === "admin") navigate("/admin/dashboard");
          else navigate("/dashboard");
        }, 150);
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center shadow-lg">
              <FaLeaf className="text-amber-700 text-2xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-green-700">
              Clariveda
            </span>
          </h1>
          <p className="text-gray-600">
            Continue your Ayurvedic wellness journey
          </p>

          {/* Decorative Elements */}
          <div className="flex justify-center mt-4">
            <div className="w-12 h-1 bg-amber-500 rounded-full mx-1"></div>
            <div className="w-4 h-4 bg-green-500 rounded-full mx-1 mt-2"></div>
            <div className="w-12 h-1 bg-amber-500 rounded-full mx-1"></div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div
                  className={`relative transition-all duration-200 ${
                    focusedField === "email" ? "transform scale-[1.02]" : ""
                  }`}
                >
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    onChange={handleChange}
                    onFocus={() => handleFocus("email")}
                    onBlur={handleBlur}
                    value={formData.email}
                    className="w-full px-12 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-amber-50/50"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div
                  className={`relative transition-all duration-200 ${
                    focusedField === "password" ? "transform scale-[1.02]" : ""
                  }`}
                >
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    onChange={handleChange}
                    onFocus={() => handleFocus("password")}
                    onBlur={handleBlur}
                    value={formData.password}
                    className="w-full px-12 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-amber-50/50"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
              </div>

              {/* Message Alert */}
              {message.text && (
                <div
                  className={`rounded-lg p-4 transition-all duration-300 ${
                    message.type === "error"
                      ? "bg-red-50 border border-red-200 text-red-700"
                      : "bg-green-50 border border-green-200 text-green-700"
                  }`}
                >
                  <div className="flex items-center">
                    <svg
                      className={`w-5 h-5 mr-2 ${
                        message.type === "error"
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">{message.text}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={authLoading}
                className={`w-full py-4 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] focus:scale-[0.98] ${
                  authLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-500 to-green-600 hover:from-amber-600 hover:to-green-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {authLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing In...
                  </div>
                ) : (
                  "Continue to Wellness"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 pt-6 border-t border-amber-200">
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-amber-600 hover:text-amber-500 transition-colors duration-200"
                >
                  Begin your journey here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Your wellness journey starts with a single step
          </p>
        </div>

        {/* Background Decorative Elements */}
        <div className="fixed top-10 left-10 w-20 h-20 bg-amber-200 rounded-full opacity-20 blur-xl -z-10"></div>
        <div className="fixed bottom-10 right-10 w-24 h-24 bg-green-200 rounded-full opacity-20 blur-xl -z-10"></div>
        <div className="fixed top-1/3 right-1/4 w-16 h-16 bg-amber-300 rounded-full opacity-15 blur-lg -z-10"></div>
      </div>
    </div>
  );
};

export default Login;
