import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";

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
    setTimeout(() => setIsProcessing(false), 200);
  };

  const handleIncrease = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    await addToCart(product._id, quantity + 1, product);
    setTimeout(() => setIsProcessing(false), 200);
  };

  const handleDecrease = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    if (quantity > 1) {
      await addToCart(product._id, quantity - 1, product);
    } else {
      await addToCart(product._id, 0, product);
    }
    setTimeout(() => setIsProcessing(false), 200);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition flex flex-col justify-between">
      <div className="w-full h-48 bg-gray-50 flex items-center justify-center p-3 overflow-hidden border-b border-gray-100">
        <img
          src={product.imageUrl || "/placeholder.png"}
          alt={product.productname}
          className="max-h-full max-w-full object-contain hover:scale-105 transition duration-200"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">
              {product.type || "Ayurvedic"}
            </span>
          </div>

          <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-1 mb-1" title={product.productname}>
            {product.productname}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
            {product.description}
          </p>
        </div>

        <div className="pt-2 border-t border-gray-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-gray-400 block">Price</span>
            <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
          </div>

          <div>
            {quantity === 0 ? (
              <button
                onClick={handleAddToCart}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold px-3.5 py-2 rounded-md transition shadow-sm disabled:opacity-50"
              >
                <FaShoppingCart size={12} />
                <span>Add</span>
              </button>
            ) : (
              <div className="flex items-center border border-emerald-600 rounded-md overflow-hidden bg-emerald-50 text-emerald-800">
                <button
                  onClick={handleDecrease}
                  disabled={isProcessing}
                  className="px-2.5 py-1 text-xs hover:bg-emerald-100 font-bold transition"
                >
                  <FaMinus size={9} />
                </button>
                <span className="px-2 text-xs font-bold min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  disabled={isProcessing}
                  className="px-2.5 py-1 text-xs hover:bg-emerald-100 font-bold transition"
                >
                  <FaPlus size={9} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
