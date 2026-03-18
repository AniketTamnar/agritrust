const express = require("express");
const router = express.Router();
const UserSettings = require("../models/UserSettings");
const sendEmail = require("../utils/sendEmail"); // your email util

// Save user settings and send emails
router.post("/", async (req, res) => {
  try {
    const { fullName, email, emailNotify, weeklyReport } = req.body;

    if (!email || !fullName) {
      return res.status(400).json({ message: "Full name and email are required" });
    }

    // Save or update settings in DB
    await UserSettings.findOneAndUpdate(
      { email },
      { fullName, email, emailNotify, weeklyReport },
      { upsert: true, new: true }
    );

    // Send email if notifications enabled
    if (emailNotify) {
      await sendEmail(
        email,
        "✅ AgriTrust Notification Enabled",
        `Hi ${fullName},\nYou will now receive email alerts for price changes.`
      );
    }

    // Optional: send weekly report immediately (demo)
    if (weeklyReport) {
      await sendEmail(
        email,
        "📊 Your Weekly AgriTrust Report",
        `Hi ${fullName},\nHere is your weekly summary report (demo).`
      );
    }

    res.status(200).json({ message: "✅ Settings saved and email sent successfully" });
  } catch (err) {
    console.error("Settings Error:", err);
    res.status(500).json({ message: "Failed to save settings" });
  }
});

module.exports = router;
