// models/Cart.js
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // 🔥 improves speed
  },

  items: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product",
        required: true 
      },

      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String },

      quantity: { type: Number, default: 1, min: 1 },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
