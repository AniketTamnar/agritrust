require("dotenv").config();
const mongoose = require("mongoose");
const UserSettings = require("./models/UserSettings");
const GrainPrice = require("./models/GrainPrice");
const sendEmail = require("./utils/sendEmail");

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected for Price Watcher"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

async function checkPriceChanges() {
  try {
    const prices = await GrainPrice.find();

    for (const price of prices) {
      const { grain, city, latestPrice, previousPrice } = price;

      // Only send email if previousPrice exists and is different
      if (previousPrice && previousPrice !== latestPrice) {
        const direction = latestPrice > previousPrice ? "increased" : "decreased";
        const changeAmount = Math.abs(latestPrice - previousPrice);

        // Fetch users who want email notifications
        const users = await UserSettings.find({ emailNotify: true });

        for (const user of users) {
          // HTML email content
          const htmlMessage = `
            <p>Hello <b>${user.fullName}</b>,</p>
            <p>We hope this message finds you well!</p>
            <p>📊 <b>Market Update for your area:</b></p>
            <ul>
              <li><b>Grain:</b> ${grain}</li>
              <li><b>City:</b> ${city}</li>
              <li><b>Price Change:</b> ${direction} by ₹${changeAmount}/qtl</li>
              <li><b>Previous Price:</b> ₹${previousPrice}/qtl</li>
              <li><b>Current Price:</b> ₹${latestPrice}/qtl</li>
            </ul>
            <p>Thank you for being a valued member of <b>AgriTrust</b>. We are committed to providing timely updates to help you make informed decisions.</p>
            <p>Stay productive and keep thriving!</p>
            <p><b>AgriTrust Team 🌱</b></p>
          `;

          await sendEmail(
            user.email,
            `📈 ${grain} Price Alert (${city})`,
            htmlMessage
          );

          console.log(`✅ Email sent to ${user.email} for ${grain} in ${city}`);
        }
      }

      // Update previousPrice for next check
      price.previousPrice = latestPrice;
      await price.save();
    }
  } catch (err) {
    console.error("🔥 Price Watcher Error:", err);
  }
}

// Run every 5 minutes
setInterval(checkPriceChanges, 5 * 60 * 1000);
console.log("💹 Price watcher started, checking every 5 minutes...");
