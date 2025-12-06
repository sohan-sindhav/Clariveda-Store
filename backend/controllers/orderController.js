// controllers/orderController.js
import Order from "../models/Order.js";
import Cart from "../models/cart.js";
import mongoose from "mongoose";
import razorpay from "../configs/razorpay.js"; // <-- new: require this file (see note below)

/**
 * Helper to get canonical user id
 */
const getUserId = (req) => req.user?._id || req.user?.id;

/**
 * Create new order from user's cart (expects shippingAddress + paymentMethod in body)
 */
// inside controllers/orderController.js — replace existing createOrder with this
export const createOrder = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const { paymentMethod = "COD", shippingAddress = {} } = req.body;

    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.address ||
      !shippingAddress.city
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Shipping address incomplete." });
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || !cart.items || cart.items.length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Your cart is empty or not synced. Please try again after syncing.",
        });
    }

    const orderItems = [];
    for (const item of cart.items) {
      if (!item.product) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Cart contains invalid product data. Please resync cart.",
          });
      }
      const prodId = item.product._id || item.product;
      const price = Number(item.product.price || 0);
      const qty = Number(item.quantity || 0);
      if (!prodId || qty <= 0) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Invalid cart item found. Please resync cart.",
          });
      }
      orderItems.push({
        product: prodId,
        quantity: qty,
        priceAtPurchase: price,
      });
    }

    const totalAmount = orderItems.reduce(
      (s, i) => s + i.priceAtPurchase * i.quantity,
      0
    );
    console.log(
      "createOrder: user:",
      userId,
      "paymentMethod:",
      paymentMethod,
      "totalAmount:",
      totalAmount
    );

    if (totalAmount <= 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Order total must be greater than 0.",
        });
    }

    // Razorpay requires minimum amount (usually >= 1 INR = 100 paise). Enforce a guard:
    const minPaise = 100; // 1 INR
    if (Math.round(totalAmount * 100) < minPaise && paymentMethod !== "COD") {
      return res
        .status(400)
        .json({
          success: false,
          message: `Amount too small for gateway payments. Minimum is ₹${(
            minPaise / 100
          ).toFixed(2)}.`,
        });
    }

    const newOrder = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      paymentInfo: { method: paymentMethod, status: "Pending" },
      shippingAddress,
      status: paymentMethod === "COD" ? "Processing" : "Pending",
    });

    // If payment is non-COD -> create Razorpay order
    if (paymentMethod !== "COD") {
      // Basic env/key checks
      if (!process.env.RZP_KEY_ID || !process.env.RZP_KEY_SECRET) {
        console.error(
          "Razorpay keys missing. RZP_KEY_ID or RZP_KEY_SECRET not set."
        );
        // cleanup created order (optional)
        await Order.findByIdAndDelete(newOrder._id).catch(() => {});
        return res
          .status(500)
          .json({
            success: false,
            message: "Payment gateway misconfiguration on server.",
          });
      }

      try {
        const rzpOrder = await razorpay.orders.create({
          amount: Math.round(totalAmount * 100),
          currency: "INR",
          receipt: `order_${newOrder._id}`,
        });

        newOrder.paymentInfo.gatewayOrderId = rzpOrder.id;
        await newOrder.save();

        const populatedOrder = await Order.findById(newOrder._id).populate(
          "items.product",
          "productname price imageUrl description type"
        );

        return res.status(201).json({
          success: true,
          message: "Order created, proceed to payment",
          order: populatedOrder,
          rzpOrder,
        });
      } catch (rzErr) {
        // VERY explicit logging for debugging
        console.error(
          "Razorpay order create failed:",
          rzErr && rzErr.message ? rzErr.message : rzErr
        );
        console.error("Razorpay error full:", rzErr);
        // cleanup created order to avoid orphan orders
        await Order.findByIdAndDelete(newOrder._id).catch(() => {});
        return res.status(500).json({
          success: false,
          message: "Failed to initiate payment. See server logs for details.",
          error: rzErr?.message || String(rzErr),
        });
      }
    }

    // COD flow: clear cart and return
    await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
    const populatedOrderCOD = await Order.findById(newOrder._id).populate(
      "items.product",
      "productname price imageUrl description type"
    );

    return res.status(201).json({
      success: true,
      message: "Order placed successfully (COD)!",
      order: populatedOrderCOD,
    });
  } catch (err) {
    console.error("Order creation error stack:", err.stack || err);
    return res
      .status(500)
      .json({
        success: false,
        message: "Server error while creating order.",
        error: err.message,
      });
  }
};

/**
 * Get all orders for the current user
 */
export const getUserOrders = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const orders = await Order.find({ user: userId }).populate(
      "items.product",
      "productname price imageUrl"
    );

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Get User Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user orders.",
      error: error.message,
    });
  }
};

/**
 * Get single order by id (ensure it belongs to the requesting user)
 */
export const getOrderById = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Order id required." });

    const order = await Order.findOne({ _id: id, user: userId }).populate(
      "items.product"
    );

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Get Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching order details.",
      error: error.message,
    });
  }
};
