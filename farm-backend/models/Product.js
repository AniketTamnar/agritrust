const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    grainType: String,
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    location: String,
    image: { type: String, required: true },
    description: String,
  },
  { timestamps: true } // ✅ REQUIRED
);

module.exports = mongoose.model("Product", productSchema);
