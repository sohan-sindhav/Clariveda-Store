import Order from "../models/Order.js";
import Cart from "../models/cart.js";
import razorpay from "../configs/razorpay.js";

const getUserId = (req) => req.user?._id || req.user?.id;

export const createOrder = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

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
      return res.status(400).json({
        success: false,
        message:
          "Your cart is empty or not synced. Please try again after syncing.",
      });
    }

    const orderItems = [];
    for (const item of cart.items) {
      if (!item.product) {
        return res.status(400).json({
          success: false,
          message: "Cart contains invalid product data. Please resync cart.",
        });
      }
      const prodId = item.product._id || item.product;
      const price = Number(item.product.price || 0);
      const qty = Number(item.quantity || 0);
      if (!prodId || qty <= 0) {
        return res.status(400).json({
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

    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Order total must be greater than 0.",
      });
    }

    const newOrder = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      paymentInfo: {
        method: paymentMethod,
        status: "Pending",
      },
      shippingAddress,
      status: paymentMethod === "COD" ? "Processing" : "Pending",
    });

    if (paymentMethod !== "COD") {
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
          message: "Order initiated for payment",
          order: populatedOrder,
          rzpOrder,
        });
      } catch (rzpError) {
        console.error("Razorpay order creation failed:", rzpError);
        await Order.findByIdAndDelete(newOrder._id);
        return res.status(500).json({
          success: false,
          message: "Failed to initiate Razorpay gateway order",
          error: rzpError.message,
        });
      }
    }

    await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

    const populatedOrder = await Order.findById(newOrder._id).populate(
      "items.product",
      "productname price imageUrl description type"
    );

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: populatedOrder,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while creating order.",
      error: err.message,
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("items.product", "productname price imageUrl");

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("getUserOrders error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user orders.",
      error: error.message,
    });
  }
};

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

    let query = { _id: id };
    if (req.user.role !== "admin") {
      query.user = userId;
    }

    const order = await Order.findOne(query)
      .populate("items.product")
      .populate("user", "username email");

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("getOrderById error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching order details.",
      error: error.message,
    });
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("items.product", "productname price imageUrl type")
      .populate("user", "username email");

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("getAllOrdersAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all orders",
      error: error.message,
    });
  }
};

export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Accepted",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;
    if (status === "Delivered" && order.paymentInfo) {
      order.paymentInfo.status = "Completed";
    }

    await order.save();

    const populatedOrder = await Order.findById(id)
      .populate("items.product", "productname price imageUrl type")
      .populate("user", "username email");

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: populatedOrder,
    });
  } catch (error) {
    console.error("updateOrderStatusAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};
