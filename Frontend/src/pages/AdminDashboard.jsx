import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { axiosProduct, PRODUCT_ENDPOINTS } from "../api/productConfig";
import { axiosOrder, ORDER_ENDPOINTS } from "../api/orderConfig";
import {
  FaBox,
  FaShoppingBag,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTruck,
  FaSync,
  FaUpload,
} from "react-icons/fa";

const STATUS_OPTIONS = [
  "Pending",
  "Processing",
  "Accepted",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [orderSearch, setOrderSearch] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [deletingProductId, setDeletingProductId] = useState(null);

  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    productname: "",
    description: "",
    price: "",
    type: "",
  });
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: "", text: "" });

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError("");
      const res = await axiosOrder.get(ORDER_ENDPOINTS.adminAll);
      setOrders(res.data.orders || []);
    } catch (err) {
      setOrdersError(
        err.response?.data?.message || "Failed to load customer orders"
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError("");
      const res = await axiosProduct.get(PRODUCT_ENDPOINTS.all);
      setProducts(res.data.products || []);
    } catch (err) {
      setProductsError(
        err.response?.data?.message || "Failed to load store products"
      );
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const res = await axiosOrder.put(
        ORDER_ENDPOINTS.adminUpdateStatus(orderId),
        { status: newStatus }
      );
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? res.data.order : ord))
        );
      }
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to update order status"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }
    try {
      setDeletingProductId(productId);
      const res = await axiosProduct.delete(
        PRODUCT_ENDPOINTS.delete(productId)
      );
      if (res.data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleStartEditProduct = (product) => {
    setEditingProductId(product._id);
    setProductForm({
      productname: product.productname || "",
      description: product.description || "",
      price: product.price || "",
      type: product.type || "",
    });
    setProductImage(null);
    setImagePreview(product.imageUrl || null);
    setFormMessage({ type: "", text: "" });
    setActiveTab("form");
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setProductForm({
      productname: "",
      description: "",
      price: "",
      type: "",
    });
    setProductImage(null);
    setImagePreview(null);
    setFormMessage({ type: "", text: "" });
  };

  const handleFormChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMessage({ type: "", text: "" });

    try {
      const data = new FormData();
      data.append("productname", productForm.productname);
      data.append("description", productForm.description);
      data.append("price", productForm.price);
      data.append("type", productForm.type);
      if (productImage) {
        data.append("image", productImage);
      }

      if (editingProductId) {
        const res = await axiosProduct.put(
          PRODUCT_ENDPOINTS.update(editingProductId),
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        setFormMessage({
          type: "success",
          text: res.data.message || "Product updated successfully!",
        });

        fetchProducts();
      } else {
        if (!productImage) {
          setFormMessage({
            type: "error",
            text: "Please select an image for new products",
          });
          setFormLoading(false);
          return;
        }

        const res = await axiosProduct.post(
          PRODUCT_ENDPOINTS.upload,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        setFormMessage({
          type: "success",
          text: res.data.message || "Product created successfully!",
        });

        handleCancelEdit();
        fetchProducts();
      }
    } catch (err) {
      setFormMessage({
        type: "error",
        text: err.response?.data?.message || "Action failed",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
  const pendingOrdersCount = orders.filter(
    (o) => o.status === "Pending" || o.status === "Processing" || o.status === "Accepted"
  ).length;

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus =
      orderStatusFilter === "All" || ord.status === orderStatusFilter;
    const searchLower = orderSearch.toLowerCase();
    const matchesSearch =
      !orderSearch ||
      ord._id.toLowerCase().includes(searchLower) ||
      (ord.shippingAddress?.name || "").toLowerCase().includes(searchLower) ||
      (ord.user?.email || "").toLowerCase().includes(searchLower) ||
      (ord.shippingAddress?.city || "").toLowerCase().includes(searchLower);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Shipped":
      case "Out for Delivery":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Accepted":
      case "Processing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Management Panel</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Control customer orders, catalog products, and live status workflows
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchOrders();
                fetchProducts();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-md shadow-sm transition"
            >
              <FaSync size={11} className={ordersLoading || productsLoading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => {
                handleCancelEdit();
                setActiveTab("form");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-md shadow-sm transition"
            >
              <FaPlus size={11} />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Orders</span>
              <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                <FaBox size={14} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{orders.length}</p>
            <span className="text-[11px] text-gray-400">All customer orders placed</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active / Pending</span>
              <div className="w-8 h-8 rounded bg-amber-50 text-amber-600 flex items-center justify-center">
                <FaTruck size={14} />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-700 mt-2">{pendingOrdersCount}</p>
            <span className="text-[11px] text-gray-400">Orders requiring dispatch</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Store Revenue</span>
              <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FaMoneyBillWave size={14} />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-700 mt-2">₹{totalRevenue.toFixed(2)}</p>
            <span className="text-[11px] text-gray-400">Gross order value</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Products Live</span>
              <div className="w-8 h-8 rounded bg-purple-50 text-purple-600 flex items-center justify-center">
                <FaShoppingBag size={14} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{products.length}</p>
            <span className="text-[11px] text-gray-400">Catalog active items</span>
          </div>
        </div>

        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition ${
              activeTab === "orders"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Customer Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition ${
              activeTab === "products"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Manage Products ({products.length})
          </button>

          <button
            onClick={() => setActiveTab("form")}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition ${
              activeTab === "form"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {editingProductId ? "Edit Product" : "Add Product"}
          </button>
        </div>

        {activeTab === "orders" && (
          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-5 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-xs" />
                  <input
                    type="text"
                    placeholder="Search by customer, city, or order ID..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500 w-full sm:w-auto justify-end">
                  <span>Showing {filteredOrders.length} of {orders.length} orders</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-500 mr-1 flex items-center gap-1">
                  <FaFilter size={10} />
                  <span>Status:</span>
                </span>
                {["All", ...STATUS_OPTIONS].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition ${
                      orderStatusFilter === st
                        ? "bg-emerald-600 text-white font-semibold"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {ordersLoading ? (
              <div className="py-16 text-center">
                <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-gray-500 text-xs font-medium">Loading customer orders...</p>
              </div>
            ) : ordersError ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs text-center">
                {ordersError}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-500 text-xs">
                No orders match your filter criteria.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord._id}
                    className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:border-gray-300 transition"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900">
                            Order #{ord._id.slice(-8).toUpperCase()}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusBadgeStyle(
                              ord.status
                            )}`}
                          >
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                          <FaCalendarAlt size={10} />
                          <span>
                            {new Date(ord.createdAt).toLocaleDateString()} at{" "}
                            {new Date(ord.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-base font-bold text-gray-900 block">
                            ₹{ord.totalAmount.toFixed(2)}
                          </span>
                          <span className="text-[11px] text-gray-500">
                            {ord.paymentInfo?.method || "COD"} • {ord.paymentInfo?.status || "Pending"}
                          </span>
                        </div>

                        <div className="pl-3 border-l border-gray-200">
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Change Status
                          </label>
                          <select
                            value={ord.status}
                            disabled={updatingOrderId === ord._id}
                            onChange={(e) =>
                              handleUpdateOrderStatus(ord._id, e.target.value)
                            }
                            className="text-xs font-semibold px-2.5 py-1.5 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none cursor-pointer"
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 text-xs">
                      <div>
                        <span className="font-semibold text-gray-800 block mb-1">Customer & Shipping:</span>
                        <div className="text-gray-600 space-y-0.5">
                          <p className="font-medium text-gray-800">
                            {ord.shippingAddress?.name || ord.shippingAddress?.fullName || ord.user?.username || "Guest Customer"}
                          </p>
                          <p>{ord.user?.email || "No email on file"}</p>
                          <p>
                            {ord.shippingAddress?.address || ord.shippingAddress?.addressLine},{" "}
                            {ord.shippingAddress?.city}, {ord.shippingAddress?.state} -{" "}
                            {ord.shippingAddress?.zip || ord.shippingAddress?.postalCode}
                          </p>
                          <p className="text-gray-500">Phone: {ord.shippingAddress?.phone || "-"}</p>
                        </div>
                      </div>

                      <div>
                        <span className="font-semibold text-gray-800 block mb-1">
                          Items Purchased ({ord.items.length}):
                        </span>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {ord.items.map((it, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-2 p-1.5 bg-gray-50 rounded border border-gray-100"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <img
                                  src={it.product?.imageUrl || "/placeholder.png"}
                                  alt=""
                                  className="w-7 h-7 object-contain bg-white rounded border border-gray-200 flex-shrink-0"
                                />
                                <span className="truncate text-gray-800 font-medium">
                                  {it.product?.productname || "Herbal Product"}
                                </span>
                              </div>
                              <span className="text-gray-600 font-medium whitespace-nowrap">
                                {it.quantity} × ₹{it.priceAtPurchase}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-gray-500 font-medium">
                {products.length} products listed in store
              </span>

              <button
                onClick={() => {
                  handleCancelEdit();
                  setActiveTab("form");
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-md transition"
              >
                <FaPlus size={10} />
                <span>Add New Item</span>
              </button>
            </div>

            {productsLoading ? (
              <div className="py-16 text-center">
                <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-gray-500 text-xs font-medium">Loading catalog products...</p>
              </div>
            ) : productsError ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs text-center">
                {productsError}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-500 text-xs">
                No products in store yet. Click "Add Product" to add your first product.
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Product</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Description</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((prod) => (
                        <tr key={prod._id} className="hover:bg-gray-50 transition">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.imageUrl || "/placeholder.png"}
                                alt=""
                                className="w-10 h-10 object-contain bg-gray-50 p-1 rounded border border-gray-200 flex-shrink-0"
                              />
                              <span className="font-semibold text-gray-900">{prod.productname}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px] font-medium">
                              {prod.type || "Ayurvedic"}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-gray-900">
                            ₹{prod.price}
                          </td>
                          <td className="p-3 text-gray-500 max-w-xs truncate">
                            {prod.description}
                          </td>
                          <td className="p-3 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleStartEditProduct(prod)}
                                className="p-1.5 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded border border-gray-200 transition"
                                title="Edit Product"
                              >
                                <FaEdit size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod._id, prod.productname)}
                                disabled={deletingProductId === prod._id}
                                className="p-1.5 text-gray-600 hover:text-red-700 hover:bg-red-50 rounded border border-gray-200 transition disabled:opacity-50"
                                title="Delete Product"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "form" && (
          <div className="max-w-2xl bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-5">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {editingProductId ? "Edit Product Details" : "Upload New Store Product"}
                </h2>
                <p className="text-xs text-gray-500">
                  {editingProductId
                    ? "Modify product attributes or replace the product photo"
                    : "Fill in the required fields to publish a product to the catalog"}
                </p>
              </div>

              {editingProductId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs text-gray-600 hover:text-gray-900 underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="productname"
                  value={productForm.productname}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g. Kumkumadi Face Oil"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={productForm.description}
                  onChange={handleFormChange}
                  required
                  placeholder="Describe ingredients, benefits, and instructions..."
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Price in INR (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={productForm.price}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g. 349"
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Category / Type
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={productForm.type}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g. Cleanser, Serum, Cream"
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Product Image {editingProductId && "(Leave empty to keep existing image)"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 border border-gray-300 rounded p-1"
                />
              </div>

              {imagePreview && (
                <div className="p-3 bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-40 max-w-full object-contain rounded"
                  />
                </div>
              )}

              {formMessage.text && (
                <div
                  className={`p-3 rounded text-xs font-medium ${
                    formMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {formMessage.text}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-2 px-4 rounded text-xs transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FaUpload size={12} />
                  <span>
                    {formLoading
                      ? "Saving Product..."
                      : editingProductId
                      ? "Update Product Details"
                      : "Create Product"}
                  </span>
                </button>

                {editingProductId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded text-xs transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
