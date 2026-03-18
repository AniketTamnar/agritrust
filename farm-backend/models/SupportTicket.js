const mongoose = require("mongoose");

const SupportTicketSchema = new mongoose.Schema({
  customerName: String,
  customerEmail: String,
  issue: String,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SupportTicket", SupportTicketSchema);
