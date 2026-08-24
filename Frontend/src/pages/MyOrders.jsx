import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { axiosOrder, ORDER_ENDPOINTS } from "../api/orderConfig";
import { FaCalendarAlt, FaBoxOpen, FaArrowRight } from "react-icons/fa";

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axiosOrder.get(ORDER_ENDPOINTS.myOrders);
        if (data.success) setOrders(data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-500 text-sm">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {orders.length} total order{orders.length !== 1 ? "s" : ""} placed
            </p>
          </div>
          <Link
            to="/dashboard"
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Browse Products
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center max-w-md mx-auto my-8">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
              <FaBoxOpen size={24} />
            </div>
            <h2 className="text-base font-semibold text-gray-800 mb-1">No orders found</h2>
            <p className="text-xs text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Link
              to="/dashboard"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-md shadow-sm transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                      <FaCalendarAlt size={10} />
                      <span>{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900 block">
                      ₹{order.totalAmount}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {order.paymentInfo?.method || "COD"} • {order.paymentInfo?.status || "Pending"}
                    </span>
                  </div>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((it, idx) => (
                        <img
                          key={idx}
                          src={it.product?.imageUrl || "/placeholder.png"}
                          alt={it.product?.productname}
                          className="w-10 h-10 object-contain rounded-md border border-gray-200 bg-white p-0.5"
                        />
                      ))}
                    </div>
                    <div className="text-xs text-gray-600">
                      <p className="font-medium text-gray-800">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </p>
                      <p className="text-gray-500 truncate max-w-xs">
                        Ship to: {order.shippingAddress?.name || "-"}, {order.shippingAddress?.city || "-"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/order/${order._id}`)}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-1.5 rounded-md transition"
                  >
                    <span>View Order Details</span>
                    <FaArrowRight size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrders;
