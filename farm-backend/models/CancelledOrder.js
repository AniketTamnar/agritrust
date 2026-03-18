const mongoose = require("mongoose");

const CancelledOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    reasonId: { type: Number, required: true },
    reasonText: { type: String, required: true },
    note: String,

    cancelledBy: { type: String, default: "user" },
    cancelledAt: { type: Date, default: Date.now },

    // ✅ ADD THIS (MATCHES ROUTE)
    refundStatus: {
      type: String,
      enum: ["Not required", "Initiated", "Completed", "Failed"],
      default: "Not required",
    },

    orderSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CancelledOrder", CancelledOrderSchema);
