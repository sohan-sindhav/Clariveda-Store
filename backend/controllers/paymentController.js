// controllers/paymentController.js
import razorpay from "../configs/razorpay.js";
import Order from "../models/Order.js";
import crypto from "crypto";

export const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
      req.body;
    if (
      !orderId ||
      !razorpayPaymentId ||
      !razorpayOrderId ||
      !razorpaySignature
    )
      return res
        .status(400)
        .json({ success: false, message: "Missing params" });

    // Validate signature: sha256(orderId|paymentId) with key secret
    const generated = crypto
      .createHmac("sha256", process.env.RZP_KEY_SECRET)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generated !== razorpaySignature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // Optionally fetch payment info from Razorpay to confirm
    const payment = await razorpay.payments.fetch(razorpayPaymentId);

    if (payment.status === "captured" || payment.status === "authorized") {
      // Update order
      const order = await Order.findById(orderId);
      if (!order)
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });

      order.paymentInfo = {
        method: order.paymentInfo?.method || "UPI",
        transactionId: razorpayPaymentId,
        gatewayOrderId: razorpayOrderId,
        status: "Completed",
      };
      order.status = "Processing";
      await order.save();

      // clear user's cart (defensive)
      await Order.db
        .collection("carts")
        ?.updateOne({ user: order.user }, { $set: { items: [] } })
        .catch(() => {});

      return res.json({ success: true, message: "Payment verified", order });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Payment not successful", payment });
    }
  } catch (err) {
    console.error("verifyPayment error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
