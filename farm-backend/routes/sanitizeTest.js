const express = require("express");
const router = express.Router();
const SanitizeTest = require("../models/SanitizeTest");

router.post("/run", async (req, res) => {
  try {
    // Raw body (before sanitize)
    const original = req.body;

    // After sanitize → req.body already cleaned by express-mongo-sanitize
    const sanitized = { ...req.body };

    // Save both to MongoDB
    const result = await SanitizeTest.create({
      originalInput: original,
      sanitizedInput: sanitized
    });

    res.json({
      message: "Sanitize test completed",
      saved: result
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error running sanitize test" });
  }
});

module.exports = router;
