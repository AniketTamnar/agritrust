const mongoose = require("mongoose");

const GrainPriceSchema = new mongoose.Schema({
  grain: String,
  city: String,
  latestPrice: Number,
  previousPrice: Number,
});

module.exports = mongoose.model("GrainPrice", GrainPriceSchema);
