import { useState } from "react";
import { axiosProduct, PRODUCT_ENDPOINTS } from "../api/productConfig";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaArrowLeft, FaUpload, FaCheckCircle } from "react-icons/fa";

const ProductUploadForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productname: "",
    description: "",
    price: "",
    type: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage({ type: "error", text: "You must be logged in to upload products." });
      return;
    }

    if (!image) {
      setMessage({ type: "error", text: "Please select a product image file." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const data = new FormData();
      data.append("productname", formData.productname);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("type", formData.type);
      data.append("image", image);

      const res = await axiosProduct.post(PRODUCT_ENDPOINTS.upload, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({
        type: "success",
        text: res.data.message || "Product created and uploaded successfully!",
      });

      setFormData({ productname: "", description: "", price: "", type: "" });
      setImage(null);
      setPreview(null);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Upload failed. Check server logs.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upload New Product</h1>
            <p className="text-xs text-gray-500 mt-0.5">Add a new item to the store catalog</p>
          </div>
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-md shadow-sm"
          >
            <FaArrowLeft size={10} />
            <span>Admin Panel</span>
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="productname"
                value={formData.productname}
                onChange={handleChange}
                required
                placeholder="e.g. Neem & Aloe Face Cleanser"
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
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Details regarding ingredients, benefits, and usage"
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Price (INR ₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 299"
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
                  value={formData.type}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Cleanser, Oil, Serum"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required={!preview}
                className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 border border-gray-300 rounded p-1"
              />
            </div>

            {preview && (
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
                <img
                  src={preview}
                  alt="preview"
                  className="max-h-40 max-w-full object-contain rounded"
                />
              </div>
            )}

            {message.text && (
              <div
                className={`p-3 rounded text-xs font-medium ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-2.5 px-4 rounded-md text-xs transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FaUpload size={12} />
              <span>{loading ? "Uploading to Cloudinary & DB..." : "Upload Product to Store"}</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProductUploadForm;
