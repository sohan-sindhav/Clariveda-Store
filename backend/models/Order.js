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
    required: true,
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
      name: { type: String },
      fullName: { type: String },
      phone: { type: String },
      address: { type: String },
      addressLine: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
      postalCode: { type: String },
      country: { type: String, default: "India" },
    },

    paymentInfo: {
      method: {
        type: String,
        enum: ["COD", "Card", "UPI", "Online", "Razorpay"],
        default: "COD",
      },
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

    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Accepted",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
