import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { axiosOrder, ORDER_ENDPOINTS } from "../api/orderConfig";
import { FaBoxOpen, FaCalendarAlt, FaRupeeSign } from "react-icons/fa";

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

  if (loading)
    return <div className="text-center mt-20">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">My Orders</h1>
          <div className="text-sm text-gray-500">{orders.length} orders</div>
        </div>

        {orders.length === 0 ? (
          <div className="text-gray-500 text-lg">
            You haven’t placed any orders yet 🛍️
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="font-semibold text-gray-700">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h2>
                    <div className="text-xs text-gray-500 mt-1 flex items-center space-x-3">
                      <span className="flex items-center space-x-1">
                        <FaCalendarAlt />{" "}
                        <span>
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-100">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-800 flex items-center justify-end">
                      <FaRupeeSign className="mr-1" />
                      {order.totalAmount}
                    </div>
                    <button
                      onClick={() => navigate(`/order/${order._id}`)}
                      className="mt-3 inline-block text-sm text-white bg-gradient-to-r from-green-500 to-amber-500 px-3 py-1 rounded-lg shadow"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  <div className="py-3 flex items-center gap-4">
                    {/* show up to 3 product thumbnails */}
                    <div className="flex -space-x-3">
                      {order.items.slice(0, 3).map((it, idx) => (
                        <img
                          key={idx}
                          src={it.product?.imageUrl || "/placeholder.png"}
                          alt={it.product?.productname}
                          className="w-12 h-12 object-cover rounded-md border"
                        />
                      ))}
                    </div>

                    <div className="text-sm text-gray-600">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""} •{" "}
                      {order.paymentInfo?.method || "COD"} •{" "}
                      {order.paymentInfo?.status || "Pending"}
                    </div>
                  </div>

                  <div className="py-3 text-sm text-gray-600">
                    <div>
                      <strong>Ship to:</strong>{" "}
                      {order.shippingAddress?.name || "-"},{" "}
                      {order.shippingAddress?.city || "-"}
                    </div>
                    <div className="mt-1">
                      <strong>Payment:</strong> {order.paymentInfo?.method} —{" "}
                      {order.paymentInfo?.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
