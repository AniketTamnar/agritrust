const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema({
  index: Number,
  timestamp: { type: Date, default: Date.now },
  transactions: Array,
  previousHash: String,
  hash: String,
  nonce: Number,
  difficulty: Number,
  merkleRoot: String,
});

module.exports = mongoose.model("Block", blockSchema);
