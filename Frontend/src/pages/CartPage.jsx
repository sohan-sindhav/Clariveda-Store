import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import { axiosOrder, ORDER_ENDPOINTS } from "../api/orderConfig";
import { axiosPayment, PAYMENT_ENDPOINTS } from "../api/paymentConfig";
import { RZP_CLIENT_KEY } from "../config/env";
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft, FaCheckCircle, FaLock } from "react-icons/fa";

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
    paymentMethod: "Online",
    upiId: "",
  });

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
    setTimeout(() => setIsUpdating(null), 200);
  };

  const handleRemove = async (productId) => {
    setIsUpdating(productId);
    await removeFromCart(productId);
    setTimeout(() => setIsUpdating(null), 200);
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to remove all items from your cart?")) {
      await clearCart();
    }
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      alert("Please enter your full name.");
      return false;
    }
    if (!form.phone.trim()) {
      alert("Please enter your contact phone number.");
      return false;
    }
    if (!form.address.trim()) {
      alert("Please enter your delivery street address.");
      return false;
    }
    if (!form.city.trim()) {
      alert("Please enter your city.");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!validateForm()) return;

    try {
      setCheckoutLoading(true);

      try {
        await syncToBackend();
      } catch (syncErr) {
        console.warn("Cart sync warning:", syncErr);
      }

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

      const createRes = await axiosOrder.post(
        ORDER_ENDPOINTS.create,
        orderPayload,
        { withCredentials: true }
      );

      const data = createRes.data;
      if (!data || !data.success) {
        alert("Order creation failed: " + (data?.message || "unknown error"));
        setCheckoutLoading(false);
        return;
      }

      const serverOrder = data.order;

      if (form.paymentMethod !== "COD" && data.rzpOrder) {
        const rzpOrder = data.rzpOrder;

        if (!window.Razorpay) {
          alert("Razorpay SDK not loaded. Please refresh the page and try again.");
          setCheckoutLoading(false);
          return;
        }

        if (!RZP_CLIENT_KEY) {
          alert("Razorpay Client Key missing. Please check your environment configuration.");
          setCheckoutLoading(false);
          return;
        }

        const options = {
          key: RZP_CLIENT_KEY,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: "Clariveda Store",
          description: `Order #${serverOrder._id.slice(-8).toUpperCase()}`,
          order_id: rzpOrder.id,
          handler: async function (response) {
            try {
              const verifyRes = await axiosPayment.post(
                PAYMENT_ENDPOINTS.verify,
                {
                  orderId: serverOrder._id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                }
              );

              if (verifyRes.data?.success) {
                await clearCart();
                navigate(`/order/${serverOrder._id}`);
              } else {
                alert("Payment verification failed: " + (verifyRes.data?.message || "Error"));
              }
            } catch (verErr) {
              alert("Payment verification error. Please check your orders page.");
            }
          },
          prefill: {
            name: form.name,
            contact: form.phone,
          },
          theme: {
            color: "#059669",
          },
          modal: {
            ondismiss: function () {
              setCheckoutLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        await clearCart();
        navigate(`/order/${serverOrder._id}`);
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to place order. Please try again.";
      alert(msg);
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {items.length} item{items.length !== 1 ? "s" : ""} in your cart
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
          >
            <FaArrowLeft size={10} />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {syncError && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-800">
            Network sync delay detected. Your local cart changes are preserved.
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center max-w-md mx-auto my-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
              <FaShoppingBag size={24} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Your cart is empty</h2>
            <p className="text-xs text-gray-500 mb-5">Browse our catalog to add herbal products to your cart.</p>
            <Link
              to="/dashboard"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-md transition shadow-sm"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200">
                {items.map((item) => {
                  const product = item.product || {};
                  const isLoading = isUpdating === product._id;
                  return (
                    <div key={product._id} className="p-4 flex gap-4 items-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-md p-1 border border-gray-100 flex-shrink-0 flex items-center justify-center">
                        <img
                          src={product.imageUrl || "/placeholder.png"}
                          alt={product.productname}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {product.productname}
                        </h3>
                        <p className="text-xs text-gray-500">{product.type || "Herbal"}</p>
                        <p className="text-xs font-semibold text-gray-800 mt-1">
                          ₹{product.price} each
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-300 rounded bg-white">
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(
                                product._id,
                                Math.max(item.quantity - 1, 1)
                              )
                            }
                            disabled={isLoading || isProcessing}
                            className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <FaMinus size={8} />
                          </button>
                          <span className="px-2 text-xs font-bold text-gray-800 min-w-[20px] text-center">
                            {isLoading ? ".." : item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(product._id, item.quantity + 1)
                            }
                            disabled={isLoading || isProcessing}
                            className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <FaPlus size={8} />
                          </button>
                        </div>

                        <div className="text-right w-16">
                          <span className="text-sm font-bold text-gray-900 block">
                            ₹{(product.price || 0) * item.quantity}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(product._id)}
                          disabled={isLoading || isProcessing}
                          className="text-gray-400 hover:text-red-600 p-1 transition"
                          title="Remove item"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={handleClearCart}
                  disabled={isProcessing}
                  className="text-red-600 hover:underline disabled:opacity-50"
                >
                  Clear all items
                </button>
                <span className="text-gray-500">Free delivery applied to all orders</span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-200">
                Order Summary & Checkout
              </h2>

              <div className="py-3 space-y-1.5 text-xs border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-emerald-700 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total Payable</span>
                  <span className="text-emerald-700">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={handlePlaceOrder} className="mt-4 space-y-3">
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Delivery Details
                </h3>

                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter receiver's name"
                    className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="10-digit mobile number"
                    className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    placeholder="House no, street, landmark"
                    className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      placeholder="City"
                      className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">PIN / Postal Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={form.zip}
                    onChange={handleChange}
                    placeholder="Postal Code"
                    className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-2">
                    Payment Method
                  </label>
                  <div className="space-y-1.5 text-xs">
                    <label className="flex items-center gap-2 p-2.5 border border-emerald-300 bg-emerald-50/50 rounded cursor-pointer hover:bg-emerald-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Online"
                        checked={form.paymentMethod === "Online"}
                        onChange={handleChange}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-gray-900 block">
                          Online Payment (Razorpay)
                        </span>
                        <span className="text-[11px] text-gray-500">
                          UPI, Google Pay, PhonePe, Cards, NetBanking
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={form.paymentMethod === "COD"}
                        onChange={handleChange}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-gray-900 block">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Pay cash upon receiving your delivery
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-2.5 px-4 rounded-md text-sm transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {form.paymentMethod === "Online" ? (
                    <>
                      <FaLock size={12} />
                      <span>{checkoutLoading ? "Opening Gateway..." : `Pay ₹${totalPrice.toFixed(2)} with Razorpay`}</span>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle size={14} />
                      <span>{checkoutLoading ? "Placing Order..." : `Place Cash on Delivery Order`}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
