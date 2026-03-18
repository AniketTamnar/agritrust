const express = require("express");
const router = express.Router();
require("dotenv").config();

const Price = require("../models/Price");
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/", async (req, res) => {
  try {
    const { grain, city } = req.body;

    const prices = await Price.find({ grain, city }).sort({ date: 1 });

    if (!prices.length) {
      return res.json({ summary: "No data available for this crop and city." });
    }

    // ⭐ Step 1: Get latest price
    const latestPrice = prices[prices.length - 1].price;

    // Step 2: Format data to send to AI
    const data = prices.map((p) => ({
      date: p.date.toISOString().split("T")[0],
      price: p.price,
    }));

    // Step 3: Smooth AI Prompt
    const prompt = `
You are an agricultural market expert. Create a smooth, simple, farmer-friendly summary in:

1) English  
2) Hindi  
3) Marathi  

Include latest price FIRST.

------------------------------------
🌾 ENGLISH SUMMARY:
• Latest Price: ₹${latestPrice}
• Trend: ...
• Highest Price: ₹...
• Lowest Price: ₹...
• Market Condition: ...
• Farmer Advice: ...
• Next 30 Days Prediction: ...

------------------------------------
🇮🇳 HINDI SUMMARY:
• नवीनतम कीमत: ₹${latestPrice}
• रुझान: ...
• सबसे अधिक कीमत: ₹...
• सबसे कम कीमत: ₹...
• बाज़ार स्थिति: ...
• किसानों के लिए सलाह: ...
• अगले 30 दिनों का अनुमान: ...

------------------------------------
🇮🇳 MARATHI SUMMARY:
• नवीनतम भाव: ₹${latestPrice}
• कल: ...
• जास्तीत जास्त भाव: ₹...
• किमान भाव: ₹...
• बाजार स्थिती: ...
• शेतकऱ्यांसाठी सल्ला: ...
• पुढील ३० दिवसांचा अंदाज: ...

------------------------------------

DATA:
${JSON.stringify(data, null, 2)}

Keep the writing smooth, short, easy to understand.
    `;

    // Step 4: AI Call
    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You analyze agricultural price trends." },
        { role: "user", content: prompt },
      ],
    });

    // Step 5: Send final summary
    const summary = ai.choices[0].message.content.trim();
    res.json({ summary });

  } catch (err) {
    console.log("AI Summary Error:", err);
    res.json({ summary: "AI could not generate summary." });
  }
});

module.exports = router;
