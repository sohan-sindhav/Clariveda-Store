import { useState } from "react";
import { axiosProduct, PRODUCT_ENDPOINTS } from "../api/productConfig";
import { useAuth } from "../context/AuthContext";

const ProductUploadForm = () => {
  const { user } = useAuth();
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

  // handle text input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage({ type: "error", text: "You must be logged in to upload." });
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
      if (image) data.append("image", image);

      const res = await axiosProduct.post(PRODUCT_ENDPOINTS.upload, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({
        type: "success",
        text: res.data.message || "Uploaded successfully!",
      });

      // reset
      setFormData({ productname: "", description: "", price: "", type: "" });
      setImage(null);
      setPreview(null);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Upload failed!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-gray-800 text-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-5 text-center">
        Upload New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* product name */}
        <div>
          <label className="block text-sm mb-1">Product Name</label>
          <input
            type="text"
            name="productname"
            value={formData.productname}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* description */}
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* price */}
        <div>
          <label className="block text-sm mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* type */}
        <div>
          <label className="block text-sm mb-1">Type</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* image */}
        <div>
          <label className="block text-sm mb-1">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full bg-gray-700 rounded-md border border-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-600 file:text-white file:cursor-pointer"
          />
        </div>

        {/* preview */}
        {preview && (
          <div className="mt-3 flex justify-center">
            <img
              src={preview}
              alt="preview"
              className="w-48 h-48 object-cover rounded-md border border-gray-600"
            />
          </div>
        )}

        {/* message */}
        {message.text && (
          <p
            className={`text-center font-semibold ${
              message.type === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 mt-4 bg-indigo-600 hover:bg-indigo-700 transition rounded-md font-semibold"
        >
          {loading ? "Uploading..." : "Upload Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductUploadForm;
