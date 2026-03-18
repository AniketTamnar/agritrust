const mongoose = require("mongoose");

const UserSettingsSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  emailNotify: { type: Boolean, default: false },
  weeklyReport: { type: Boolean, default: false },
});

module.exports = mongoose.model("UserSettings", UserSettingsSchema);
