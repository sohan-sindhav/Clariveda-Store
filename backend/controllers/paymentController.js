import crypto from "crypto";
import Order from "../models/Order.js";
import Cart from "../models/cart.js";

export const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
      req.body;

    if (
      !orderId ||
      !razorpayPaymentId ||
      !razorpayOrderId ||
      !razorpaySignature
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing payment verification parameters" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RZP_KEY_SECRET)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      console.error("Invalid payment signature mismatch");
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.paymentInfo = {
      method: order.paymentInfo?.method || "Online",
      transactionId: razorpayPaymentId,
      gatewayOrderId: razorpayOrderId,
      status: "Completed",
    };
    order.status = "Processing";
    await order.save();

    await Cart.findOneAndUpdate(
      { user: order.user },
      { $set: { items: [] } }
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (err) {
    console.error("verifyPayment error:", err);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: err.message,
    });
  }
};
