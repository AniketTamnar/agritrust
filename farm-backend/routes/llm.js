const express = require("express");
const router = express.Router();
const { askLLM } = require("../services/llmService");
const QA = require("../models/QA");

router.post("/ask", async (req, res) => {
  try {
    const { prompt } = req.body;

    // ✅ Validate input
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt missing or invalid" });
    }

    const cleanPrompt = prompt.trim().toLowerCase();

    // ✅ Check cache
    const cached = await QA.findOne({ question: cleanPrompt });
    if (cached) {
      return res.json({
        answer: cached.answer,
        source: "cache"
      });
    }

    // ✅ Call AI
    const answer = await askLLM(cleanPrompt);

    // ✅ Save in DB
    await QA.create({
      question: cleanPrompt,
      answer,
    });

    return res.json({
      answer,
      source: "llm"
    });

  } catch (error) {
    console.error("ROUTE ERROR:", error);

    return res.status(500).json({
      error: error.message || "Server error",
      code: error.code || null
    });
  }
});

module.exports = router;
