import Cart from "../models/cart.js";
import Product from "../models/product.js";

const getUserId = (req) => req.user?._id || req.user?.id;

export const addToCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    let { productId, quantity } = req.body;
    if (!productId)
      return res
        .status(400)
        .json({ success: false, message: "productId required" });

    quantity = Number(quantity) || 1;
    if (quantity < 0) quantity = 0;
    if (quantity > 50) quantity = 50;

    const product = await Product.findById(productId);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    const existingIndex = cart.items.findIndex(
      (it) => it.product.toString() === productId.toString()
    );

    if (existingIndex > -1) {
      if (quantity === 0) {
        cart.items.splice(existingIndex, 1);
      } else {
        cart.items[existingIndex].quantity = quantity;
      }
    } else {
      if (quantity > 0) {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "productname price imageUrl description type"
    );

    return res.status(200).json({
      success: true,
      message:
        quantity === 0
          ? "Product removed from cart."
          : "Cart updated successfully.",
      cart: updatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating cart.",
      error: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "productname price imageUrl description type"
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty.",
        cart: { items: [] },
      });
    }

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching cart.",
      error: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const { productId } = req.params;
    if (!productId)
      return res
        .status(400)
        .json({ success: false, message: "productId is required" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found." });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "productname price imageUrl description type"
    );

    return res.status(200).json({
      success: true,
      message: "Product removed successfully.",
      cart: updatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error removing product.",
      error: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found." });

    cart.items = [];
    await cart.save();

    return res
      .status(200)
      .json({ success: true, message: "Cart cleared successfully.", cart });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error clearing cart.",
      error: error.message,
    });
  }
};

export const syncCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const { items = [] } = req.body;

    const sanitized = items
      .filter((it) => it && Number(it.quantity) > 0)
      .map((it) => {
        const productId = it.product && (it.product._id || it.product);
        return { product: productId, quantity: Number(it.quantity) };
      })
      .filter((it) => it.product);

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: sanitized });
    } else {
      cart.items = sanitized;
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "productname price imageUrl description type"
    );

    return res.status(200).json({ success: true, cart: populatedCart });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cart sync failed",
      error: error.message,
    });
  }
};
