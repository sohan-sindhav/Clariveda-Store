// models/Order.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  priceAtPurchase: {
    type: Number,
    required: true, // store price at order time in case it changes later
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],

    shippingAddress: {
      fullName: { type: String },
      phone: { type: String },
      addressLine: { type: String },
      city: { type: String },
      postalCode: { type: String },
      state: { type: String },
      country: { type: String },
    },

    paymentInfo: {
      method: { type: String, enum: ["COD", "Card", "UPI"], default: "COD" },
      transactionId: { type: String },
      gatewayOrderId: { type: String },
      status: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending",
      },
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    // <-- include "Pending" in order-level status enum
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
