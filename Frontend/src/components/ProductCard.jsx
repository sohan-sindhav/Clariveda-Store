import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();
  const [quantity, setQuantity] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (cart && Array.isArray(cart.items)) {
      const cartItem = cart.items.find(
        (item) =>
          item.product?._id === product._id || item.product === product._id
      );
      setQuantity(cartItem ? cartItem.quantity : 0);
    } else {
      setQuantity(0);
    }
  }, [cart, product._id]);

  const handleAddToCart = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    await addToCart(product._id, 1, product);
    setTimeout(() => setIsProcessing(false), 300);
  };

  const handleIncrease = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    await addToCart(product._id, quantity + 1, product);
    setTimeout(() => setIsProcessing(false), 300);
  };

  const handleDecrease = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    if (quantity > 1) {
      await addToCart(product._id, quantity - 1, product);
    } else {
      await addToCart(product._id, 0, product);
    }
    setTimeout(() => setIsProcessing(false), 300);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-4 flex flex-col">
      <div className="w-full h-48 flex items-center justify-center overflow-hidden rounded-xl mb-4 bg-gray-50">
        <img
          src={product.imageUrl}
          alt={product.productname}
          className="w-auto h-full object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate">
            {product.productname}
          </h2>
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">
            {product.description}
          </p>
        </div>

        <div className="mt-auto">
          <p className="text-gray-800 font-medium mb-1">₹{product.price}</p>
          <p className="text-xs text-gray-400 uppercase mb-3">{product.type}</p>

          {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={isProcessing}
              className={`w-full text-white text-sm py-2 rounded-md transition-all duration-300 ${
                isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 active:scale-95"
              }`}
            >
              Add to Cart 🛒
            </button>
          ) : (
            <div className="flex items-center justify-between bg-green-600 text-white rounded-md overflow-hidden">
              <button
                onClick={handleDecrease}
                disabled={isProcessing}
                className={`px-3 py-2 text-lg transition-all ${
                  isProcessing
                    ? "bg-green-700 opacity-70"
                    : "hover:bg-green-700"
                }`}
              >
                −
              </button>
              <span className="px-4 text-sm font-semibold select-none">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                disabled={isProcessing}
                className={`px-3 py-2 text-lg transition-all ${
                  isProcessing
                    ? "bg-green-700 opacity-70"
                    : "hover:bg-green-700"
                }`}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
