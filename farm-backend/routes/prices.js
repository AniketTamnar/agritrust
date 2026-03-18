const express = require("express");
const router = express.Router();

const Price = require("../models/Price");
const UserSettings = require("../models/UserSettings");
const sendEmail = require("../utils/sendEmail");

// Add price entry + send notifications
router.post("/", async (req, res) => {
  try {
    const { grain, city, price } = req.body;

    if (!grain || !city || !price) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newPrice = new Price({ grain, city, price });
    await newPrice.save();

    const subscribers = await UserSettings.find({ emailNotify: true });

    for (const u of subscribers) {
      const lastPrice = await Price.findOne({ grain, city })
        .sort({ date: -1 })
        .skip(1);

      const previousPrice = lastPrice ? lastPrice.price : null;
      const trend =
        previousPrice && price > previousPrice
          ? "increased 📈"
          : previousPrice && price < previousPrice
          ? "decreased 📉"
          : "stable";

      const msg = `
Hello ${u.fullName},

🌾 New Market Update for ${grain} in ${city}

Previous Price: ₹${previousPrice ?? "N/A"}
Current Price:  ₹${price}
Trend: ${trend}

Insights:
- ${
        trend.includes("increased")
          ? "Consider selling soon."
          : trend.includes("decreased")
          ? "Good time to hold or buy items."
          : "Prices are stable currently."
      }
- Compare nearby market prices weekly.

Regards,  
AgriTrust Team 🌱
      `;

      await sendEmail(u.email, `${grain} Price Alert - ${city}`, msg);
    }

    res.json({ message: "Price added successfully", newPrice });
  } catch (err) {
    console.error("Price Error:", err);
    res.status(500).json({ message: "Failed to add price" });
  }
});

// Get monthly average data
router.get("/", async (req, res) => {
  try {
    const { grain, city } = req.query;

    const prices = await Price.find({ grain, city }).sort({ date: 1 });

    const monthly = {};

    prices.forEach((p) => {
      const month = new Date(p.date).toLocaleString("default", {
        month: "short",
      });
      if (!monthly[month]) monthly[month] = [];
      monthly[month].push(p.price);
    });

    const formatted = Object.entries(monthly).map(([month, arr]) => ({
      month,
      price: arr.reduce((a, b) => a + b, 0) / arr.length,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Failed to fetch data" });
  }
});

// Get latest price
router.get("/latest", async (req, res) => {
  try {
    const { grain, city } = req.query;

    const latest = await Price.findOne({ grain, city }).sort({ date: -1 });

    res.json({
      latestPrice: latest ? latest.price : null,
      date: latest ? latest.date : null,
    });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Failed to fetch latest price" });
  }
});

module.exports = router;
