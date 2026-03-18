// models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // CUSTOMER DETAILS
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
      type: Number,
      required: true,
      min: 1000000000,
      max: 9999999999,
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: {
      type: Number,
      required: true,
      min: 100000,
      max: 999999,
    },

    // PAYMENT
    paymentId: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["COD", "Razorpay"],
      required: true,
    },

    amount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    // ITEMS
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],

    // OPTIONAL (for tracking UI)
    deliveryStage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
