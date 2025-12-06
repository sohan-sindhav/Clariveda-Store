import React, { useEffect, useState } from "react";
import { axiosProduct, PRODUCT_ENDPOINTS } from "../api/productConfig";
import ProductCard from "./ProductCard";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosProduct.get(PRODUCT_ENDPOINTS.all);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading)
    return <div className="text-center text-gray-500">Loading products...</div>;

  if (error)
    return <div className="text-center text-red-500 font-medium">{error}</div>;

  if (products.length === 0)
    return (
      <div className="text-center text-gray-500">No products found yet.</div>
    );

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
