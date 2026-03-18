const mongoose = require("mongoose");

const SanitizeTestSchema = new mongoose.Schema({
  originalInput: { type: Object },
  sanitizedInput: { type: Object }
});

module.exports = mongoose.model("SanitizeTest", SanitizeTestSchema);
