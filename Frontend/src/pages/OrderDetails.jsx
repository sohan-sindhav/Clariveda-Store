import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { axiosOrder, ORDER_ENDPOINTS } from "../api/orderConfig";
import { FaArrowLeft, FaRupeeSign, FaTruck } from "react-icons/fa";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axiosOrder.get(ORDER_ENDPOINTS.getById(id));
        if (data.success) setOrder(data.order);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!order) return <div className="text-center mt-20">Order not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 flex items-center gap-2 mb-4"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <div className="text-sm text-gray-500 mt-1">
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-semibold text-gray-800 flex items-center justify-end">
                <FaRupeeSign className="mr-1" /> {order.totalAmount}
              </div>
              <div className="text-sm mt-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                {order.status}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mt-6">
            <h2 className="font-semibold mb-3">Items</h2>
            <div className="space-y-3">
              {order.items.map((it, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg"
                >
                  <img
                    src={it.product?.imageUrl || "/placeholder.png"}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">
                      {it.product?.productname || it.product?.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      Qty: {it.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₹{it.priceAtPurchase}</div>
                    <div className="text-xs text-gray-500">each</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment */}
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white border p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-2">Shipping Address</h3>
              <div className="text-sm text-gray-700">
                <div>{order.shippingAddress?.name}</div>
                <div>{order.shippingAddress?.address}</div>
                <div>
                  {order.shippingAddress?.city} {order.shippingAddress?.state}{" "}
                  {order.shippingAddress?.zip}
                </div>
                <div>{order.shippingAddress?.country}</div>
                <div className="mt-2 text-xs text-gray-500">
                  Phone: {order.shippingAddress?.phone}
                </div>
              </div>
            </div>

            <div className="bg-white border p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-2">Payment</h3>
              <div className="text-sm text-gray-700">
                <div>Method: {order.paymentInfo?.method}</div>
                <div>Status: {order.paymentInfo?.status}</div>
                {order.paymentInfo?.transactionId && (
                  <div>Txn: {order.paymentInfo.transactionId}</div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <FaTruck /> <span>Current Status: {order.status}</span>
              </div>
            </div>
          </div>

          {/* Timeline / actions for user (read-only) */}
          <div className="mt-6 text-sm text-gray-500">
            <div>
              Order created at: {new Date(order.createdAt).toLocaleString()}
            </div>
            <div>
              Last updated: {new Date(order.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
