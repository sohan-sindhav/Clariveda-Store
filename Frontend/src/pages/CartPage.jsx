// src/pages/CartPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import { axiosOrder, ORDER_ENDPOINTS } from "../api/orderConfig";
import axios from "axios";
import {
  FaLeaf,
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingBag,
  FaRupeeSign,
} from "react-icons/fa";
import { RZP_CLIENT_KEY } from "../config/env.js";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    syncToBackend,
    isSyncing,
    isPendingSync,
    syncError,
  } = useCart();

  const items = cart?.items || [];
  const [isUpdating, setIsUpdating] = useState(null);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const isProcessing = isSyncing || isPendingSync || checkoutLoading;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    paymentMethod: "COD", // COD | Card | UPI
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    upiId: "",
  });

  // Vite client key — ensure .env (project root) contains VITE_RZP_KEY_ID
  const RZP_CLIENT_KEY = import.meta?.env?.VITE_RZP_KEY_ID || "";

  const totalPrice = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleQuantityChange = async (productId, newQty) => {
    setIsUpdating(productId);
    await addToCart(productId, newQty);
    setTimeout(() => setIsUpdating(null), 300);
  };

  const handleRemove = async (productId) => {
    setIsUpdating(productId);
    await removeFromCart(productId);
    setTimeout(() => setIsUpdating(null), 300);
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      await clearCart();
    }
  };

  const validateForm = () => {
    if (!form.name?.trim()) {
      alert("Please enter your full name.");
      return false;
    }
    if (!form.phone?.trim()) {
      alert("Please enter your phone number.");
      return false;
    }
    if (!form.address?.trim() || !form.city?.trim()) {
      alert("Please enter your address and city.");
      return false;
    }
    return true;
  };

  // Main checkout + Razorpay flow
  const handlePlaceOrder = async () => {
    if (isSyncing || isPendingSync) {
      alert("Please wait while your cart syncs with server...");
      return;
    }

    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!validateForm()) return;

    try {
      setCheckoutLoading(true);

      // ensure latest cart on server (debounced sync may still be pending)
      try {
        await syncToBackend();
      } catch (syncErr) {
        console.warn("Sync before placing order failed:", syncErr);
      }

      // build payload; include upiId optionally (backend can ignore it)
      const orderPayload = {
        paymentMethod: form.paymentMethod,
        shippingAddress: {
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
        upiId: form.upiId || undefined,
      };

      // Create order on server
      const createRes = await axiosOrder.post(
        ORDER_ENDPOINTS.create,
        orderPayload,
        {
          withCredentials: true,
        }
      );
      const data = createRes.data;

      if (!data || !data.success) {
        alert("Order creation failed: " + (data?.message || "unknown"));
        return;
      }

      const serverOrder = data.order;

      // If backend returned rzpOrder -> open Razorpay checkout
      if (data.rzpOrder) {
        const rzpOrder = data.rzpOrder;

        // debug logs so you can inspect values in console
        console.log("RZP_CLIENT_KEY (import.meta):", RZP_CLIENT_KEY);
        console.log("rzpOrder from server:", rzpOrder);

        if (!window.Razorpay) {
          alert(
            'Razorpay SDK not loaded. Add <script src="https://checkout.razorpay.com/v1/checkout.js"></script> to public/index.html'
          );
          return;
        }

        if (!RZP_CLIENT_KEY) {
          console.error(
            "RZP_CLIENT_KEY missing; import.meta.env:",
            import.meta?.env
          );
          alert(
            "Razorpay client key not found. Add VITE_RZP_KEY_ID to .env (project root) and restart dev server."
          );
          return;
        }

        // Build options for Razorpay
        const options = {
          key: RZP_CLIENT_KEY,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: "Clariveda",
          description: `Order #${serverOrder._id}`,
          order_id: rzpOrder.id,
          handler: async function (response) {
            try {
              // verify on server
              const verifyRes = await axios.post(
                "http://localhost:5000/api/payments/verify",
                {
                  orderId: serverOrder._id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                },
                { withCredentials: true }
              );

              if (verifyRes.data?.success) {
                alert("✅ Payment successful and verified!");
                await clearCart();
                navigate(`/order/${serverOrder._id}`);
              } else {
                console.error("verify failed:", verifyRes.data);
                alert(
                  "Payment verification failed: " +
                    (verifyRes.data.message || "See console")
                );
              }
            } catch (err) {
              console.error("verify error:", err);
              alert("Payment verification error — check server console.");
            }
          },
          prefill: {
            name: form.name,
            email: "", // optional: if you have user email from auth context
            contact: form.phone,
            vpa: form.upiId || undefined,
          },
          theme: { color: "#16a34a" },
          modal: {
            ondismiss: function () {
              console.warn("Razorpay Checkout dismissed by user");
            },
          },
        };

        console.log("Opening Razorpay with key:", options.key);
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // COD flow (or backend didn't return rzpOrder)
        alert("✅ Order placed successfully (COD or offline).");
        await clearCart();
        if (serverOrder && serverOrder._id)
          navigate(`/order/${serverOrder._id}`);
        else navigate("/myOrders");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong during checkout!";
      alert(msg);
    } finally {
      setCheckoutLoading(false);
      setShowCheckoutForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center shadow-lg">
              <FaShoppingBag className="text-amber-700 text-2xl" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-green-700">
              Ayurvedic
            </span>{" "}
            Cart
          </h1>
          <p className="text-gray-600 text-lg">
            Pure wellness products selected for you
          </p>
          <div className="flex justify-center mt-4">
            <div className="w-12 h-1 bg-amber-500 rounded-full mx-1" />
            <div className="w-4 h-4 bg-green-500 rounded-full mx-1 mt-2" />
            <div className="w-12 h-1 bg-amber-500 rounded-full mx-1" />
          </div>
        </div>

        {/* Sync error */}
        {syncError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-center">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Failed to sync cart — please check your connection</span>
            </div>
          </div>
        )}

        {/* Cart Actions */}
        {items.length > 0 && (
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-2 text-amber-700">
              <FaLeaf className="text-green-600" />
              <span className="font-medium">
                {items.length} natural product{items.length !== 1 ? "s" : ""}{" "}
                selected
              </span>
            </div>

            <button
              onClick={handleClearCart}
              disabled={isProcessing}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                isProcessing
                  ? "text-gray-400 border-gray-300 cursor-not-allowed bg-gray-100"
                  : "text-red-500 border-red-300 hover:bg-red-50 hover:border-red-400 bg-white"
              }`}
            >
              <FaTrash className="text-sm" />
              <span>{isProcessing ? "Processing..." : "Clear Cart"}</span>
            </button>
          </div>
        )}

        {/* Empty cart */}
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-12 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="text-amber-600 text-3xl" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-6">
              Discover our pure Ayurvedic products and start your wellness
              journey
            </p>
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="bg-gradient-to-r from-amber-500 to-green-600 hover:from-amber-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Items */}
            {items.map((item) => {
              const product = item.product || {};
              const isLoading = isUpdating === product._id;
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 flex-1">
                      <img
                        src={product.imageUrl || "/placeholder.png"}
                        alt={product.title || product.productname}
                        className="w-24 h-24 object-cover rounded-xl border border-amber-200"
                      />
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                          {product.title || product.productname}
                        </h2>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2 text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                            <FaRupeeSign className="text-sm" />
                            <span className="font-semibold">
                              {product.price}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 bg-green-50 text-green-700 px-3 py-1 rounded-full">
                            Pure Ayurvedic
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3 bg-amber-50 rounded-xl p-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              product._id,
                              Math.max(item.quantity - 1, 1)
                            )
                          }
                          disabled={isLoading || isProcessing}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                            isLoading || isProcessing
                              ? "bg-gray-300 cursor-not-allowed text-gray-500"
                              : "bg-amber-200 hover:bg-amber-300 text-amber-700 hover:text-amber-800"
                          }`}
                        >
                          <FaMinus className="text-sm" />
                        </button>

                        <span
                          className={`font-semibold text-gray-800 w-8 text-center ${
                            isLoading ? "opacity-50" : ""
                          }`}
                        >
                          {isLoading ? "..." : item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleQuantityChange(product._id, item.quantity + 1)
                          }
                          disabled={isLoading || isProcessing}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                            isLoading || isProcessing
                              ? "bg-gray-300 cursor-not-allowed text-gray-500"
                              : "bg-green-200 hover:bg-green-300 text-green-700 hover:text-green-800"
                          }`}
                        >
                          <FaPlus className="text-sm" />
                        </button>
                      </div>

                      <div className="text-right min-w-[100px]">
                        <div className="text-lg font-bold text-gray-800">
                          ₹{(product.price || 0) * item.quantity}
                        </div>
                        <div className="text-sm text-gray-500">Total</div>
                      </div>

                      <button
                        onClick={() => handleRemove(product._id)}
                        disabled={isLoading || isProcessing}
                        className={`p-2 rounded-lg transition ${
                          isLoading || isProcessing
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-500 hover:text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Checkout */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8 mt-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Total Amount
                  </h3>
                  <p className="text-gray-600">
                    Including all natural products
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-green-600">
                    ₹{totalPrice.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Free shipping included
                  </div>
                </div>
              </div>

              {!showCheckoutForm ? (
                <button
                  onClick={() => setShowCheckoutForm(true)}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] ${
                    isProcessing
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-amber-500 to-green-600 hover:from-amber-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  {isProcessing ? "Processing..." : "Proceed to Checkout"}
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Full name"
                      className="p-3 rounded-lg border"
                    />
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                      className="p-3 rounded-lg border"
                    />
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Address line"
                      className="p-3 rounded-lg border md:col-span-2"
                    />
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="p-3 rounded-lg border"
                    />
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="p-3 rounded-lg border"
                    />
                    <input
                      name="zip"
                      value={form.zip}
                      onChange={handleChange}
                      placeholder="Postal code"
                      className="p-3 rounded-lg border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-medium">Payment method</label>
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="COD"
                          checked={form.paymentMethod === "COD"}
                          onChange={handleChange}
                        />
                        <span>Cash on Delivery</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Card"
                          checked={form.paymentMethod === "Card"}
                          onChange={handleChange}
                        />
                        <span>Card</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="UPI"
                          checked={form.paymentMethod === "UPI"}
                          onChange={handleChange}
                        />
                        <span>UPI</span>
                      </label>
                    </div>
                  </div>

                  {form.paymentMethod === "Card" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        name="cardNumber"
                        value={form.cardNumber}
                        onChange={handleChange}
                        placeholder="Card number"
                        className="p-3 rounded-lg border"
                      />
                      <input
                        name="cardName"
                        value={form.cardName}
                        onChange={handleChange}
                        placeholder="Name on card"
                        className="p-3 rounded-lg border"
                      />
                      <input
                        name="cardExpiry"
                        value={form.cardExpiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        className="p-3 rounded-lg border"
                      />
                      <input
                        name="cardCvv"
                        value={form.cardCvv}
                        onChange={handleChange}
                        placeholder="CVV"
                        className="p-3 rounded-lg border"
                      />
                    </div>
                  )}

                  {form.paymentMethod === "UPI" && (
                    <input
                      name="upiId"
                      value={form.upiId}
                      onChange={handleChange}
                      placeholder="example@upi (optional)"
                      className="p-3 rounded-lg border"
                    />
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-amber-500 to-green-600 text-white"
                    >
                      {checkoutLoading ? "Placing order..." : "Place Order"}
                    </button>

                    <button
                      onClick={() => setShowCheckoutForm(false)}
                      disabled={isProcessing}
                      className="py-3 px-4 rounded-xl border"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="text-center mt-4">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <FaLeaf className="text-green-500" />
                  <span>
                    100% Natural • Ayurvedic Certified • Free Shipping
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="fixed top-10 left-10 w-20 h-20 bg-amber-200 rounded-full opacity-20 blur-xl -z-10" />
        <div className="fixed bottom-10 right-10 w-24 h-24 bg-green-200 rounded-full opacity-20 blur-xl -z-10" />
      </div>
    </div>
  );
};

export default CartPage;
