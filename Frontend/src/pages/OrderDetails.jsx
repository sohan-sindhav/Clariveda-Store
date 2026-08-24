import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { axiosOrder, ORDER_ENDPOINTS } from "../api/orderConfig";
import { FaArrowLeft, FaCheckCircle, FaTruck, FaMoneyBillWave } from "react-icons/fa";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-500 text-sm">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-md mx-auto py-16 text-center">
          <h2 className="text-base font-bold text-gray-800">Order not found</h2>
          <Link to="/myOrders" className="mt-3 inline-block text-xs text-emerald-600 hover:underline">
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/myOrders")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-md shadow-sm"
          >
            <FaArrowLeft size={10} />
            <span>Back to Orders</span>
          </button>
          <span className="text-xs text-gray-400">Order ID: {order._id}</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">
                  Order #{order._id.slice(-8).toUpperCase()}
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <FaCheckCircle size={10} />
                  <span>{order.status}</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-400 block">Total Amount</span>
              <span className="text-xl font-bold text-emerald-700">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="py-4 border-b border-gray-200">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
              Ordered Items ({order.items.length})
            </h2>
            <div className="divide-y divide-gray-100">
              {order.items.map((it, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={it.product?.imageUrl || "/placeholder.png"}
                      alt={it.product?.productname}
                      className="w-12 h-12 object-contain bg-gray-50 p-1 rounded border border-gray-200"
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {it.product?.productname || "Herbal Product"}
                      </h3>
                      <p className="text-xs text-gray-500">Qty: {it.quantity} × ₹{it.priceAtPurchase}</p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    ₹{it.priceAtPurchase * it.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <div className="flex items-center gap-2 mb-2 text-gray-900 font-semibold text-xs uppercase tracking-wider">
                <FaTruck className="text-emerald-600" />
                <span>Shipping Address</span>
              </div>
              <div className="text-xs text-gray-600 space-y-0.5">
                <p className="font-semibold text-gray-800">{order.shippingAddress?.name || order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.address || order.shippingAddress?.addressLine}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zip || order.shippingAddress?.postalCode}</p>
                <p>{order.shippingAddress?.country || "India"}</p>
                <p className="pt-1 text-gray-500">Contact: {order.shippingAddress?.phone}</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <div className="flex items-center gap-2 mb-2 text-gray-900 font-semibold text-xs uppercase tracking-wider">
                <FaMoneyBillWave className="text-emerald-600" />
                <span>Payment Information</span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p><span className="text-gray-500">Method:</span> <strong className="text-gray-800">{order.paymentInfo?.method || "COD"}</strong></p>
                <p><span className="text-gray-500">Payment Status:</span> <strong className="text-emerald-700">{order.paymentInfo?.status || "Pending"}</strong></p>
                <p><span className="text-gray-500">Delivery Status:</span> <strong className="text-gray-800">{order.status}</strong></p>
                <p className="pt-1 text-gray-500 text-[11px]">Free Shipping included on order</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;
