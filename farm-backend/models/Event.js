const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true 
  },

  title: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD

  repeat: { 
    type: String, 
    enum: ["none", "daily", "weekly", "monthly", "yearly"],
    default: "none"
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", EventSchema);
