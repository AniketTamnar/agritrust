const express = require("express");
const router = express.Router();
require("dotenv").config();

const Price = require("../models/Price");
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// STREAMING ROUTE
router.post("/", async (req, res) => {
  try {
    const { grain, city } = req.body;

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    const prices = await Price.find({ grain, city }).sort({ date: 1 });

    if (!prices.length) {
      res.write("No price data available.");
      return res.end();
    }

    const data = prices.map((p) => ({
      date: p.date.toISOString().split("T")[0],
      price: p.price,
    }));

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "You are an agricultural price analyst. Give smooth, line-by-line explanation."
        },
        {
          role: "user",
          content: `
Analyze this price data and return 3 summaries (English, Hindi, Marathi) in clear bullet lines:

DATA:
${JSON.stringify(data, null, 2)}
          `
        }
      ]
    });

    for await (const chunk of stream) {
      const text = chunk.choices?.[0]?.delta?.content || "";
      if (text) res.write(text);
    }

    res.end();
  } catch (err) {
    console.log("STREAM ERROR:", err);
    res.end("Failed to generate summary.");
  }
});

module.exports = router;
