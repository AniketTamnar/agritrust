// models/Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  txId: { type: String, required: true },      // Razorpay payment_id OR COD-id
  orderId: { type: String, required: true },

  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
    },
  ],

  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["Razorpay", "COD"], required: true },

  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", transactionSchema);
