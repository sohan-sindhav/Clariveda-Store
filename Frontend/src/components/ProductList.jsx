import React, { useEffect, useState } from "react";
import { axiosProduct, PRODUCT_ENDPOINTS } from "../api/productConfig";
import ProductCard from "./ProductCard";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosProduct.get(PRODUCT_ENDPOINTS.all);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please check if the backend server is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.type).filter(Boolean))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      (p.productname || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedType === "All" || p.type === selectedType;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-gray-500 text-sm font-medium">Loading products catalog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-8 p-4 bg-red-50 border border-red-200 rounded-lg text-center text-red-700 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedType(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition ${
                selectedType === cat
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-500 font-medium">No products found matching your filter.</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedType("All");
            }}
            className="mt-2 text-xs text-emerald-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
