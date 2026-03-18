const mongoose = require("mongoose");

const QASchema = new mongoose.Schema({

  question: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  answer: {
    type: String,
    required: true
  }

}, { timestamps: true });

QASchema.index({ question: 1 });

module.exports = mongoose.model("QA", QASchema);
