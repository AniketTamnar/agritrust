const express = require("express");
const router = express.Router();
const Price = require("../models/Price");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

router.get("/forecast/:grain/:city", async (req, res) => {
  const { grain, city } = req.params;

  const prices = await Price.find({ grain, city })
    .sort({ date: 1 })
    .limit(200);

  if (prices.length < 40)
    return res.status(400).json({ error: "Not enough data" });

  const csvPath = path.join(__dirname, "../ml/lstm/temp_city.csv");
  const csv = "Date,Price\n" + prices
    .map(p => `${p.date.toISOString().split("T")[0]},${p.price}`)
    .join("\n");

  fs.writeFileSync(csvPath, csv);

  const python = path.join(__dirname, "../ml/lstm/predictLSTM.py");

  exec(`python "${python}" "${grain}" "${csvPath}"`, (err, stdout, stderr) => {
    if (err || stderr) return res.status(500).json({ error: stderr });

    try {
      const result = JSON.parse(stdout);
      res.json({ grain, city, forecast: result });
    } catch {
      res.status(500).json({ error: "Python JSON parse failed" });
    }
  });
});

module.exports = router;
