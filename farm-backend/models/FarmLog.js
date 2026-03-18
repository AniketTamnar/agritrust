const mongoose = require("mongoose");

const farmLogSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    farmerId: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    acre: { type: Number, required: true },
    cropOrSeed: { type: String, required: true },
    fertilizers: { type: [String], default: [] },
    chemicals: { type: [String], default: [] },
    soilType: { type: String, required: true },
    waterType: { type: String, required: true },
    marketLocation: { type: String, required: true },
    marketCost: { type: Number, required: true },
    transport: { type: Number, required: true },
    labourCharge: { type: Number, required: true },
    investment: { type: Number, required: true },
    profit: { type: Number, required: true },
    loss: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FarmLog", farmLogSchema);
