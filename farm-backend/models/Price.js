const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  grain: String,
  city: String,
  price: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Price", priceSchema);
