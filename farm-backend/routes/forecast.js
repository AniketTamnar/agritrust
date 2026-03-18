const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");

// Python virtual environment path
const PYTHON_PATH = path.join(
  __dirname,
  "..",
  "ml",
  "lstm",
  "venv",
  "Scripts",
  "python.exe"
);

router.get("/", async (req, res) => {
  try {
    const { grain, city } = req.query;

    if (!grain) return res.status(400).json({ error: "Missing grain" });
    if (!city) return res.status(400).json({ error: "Missing city" });

    const scriptPath = path.join(__dirname, "..", "ml", "lstm", "predictLSTM.py");

    console.log("🚀 Running Python:", PYTHON_PATH);
    console.log("📜 Script:", scriptPath);

    const py = spawn(PYTHON_PATH, [scriptPath, grain]);

    let stdout = "";
    let stderr = "";

    py.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    py.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    py.on("close", (code) => {
      console.log("🐍 Python exited with code:", code);

      if (stderr.length > 0) {
        return res.status(500).json({ error: "Python Failed", details: stderr });
      }

      // Pick only the last JSON line
      const lines = stdout.trim().split("\n");
      const finalLine = lines[lines.length - 1];

      try {
        const result = JSON.parse(finalLine);

        return res.json({
          grain,
          city,
          actual: result.actual,
          forecast: result.forecast,
          dates: result.dates,
        });
      } catch (err) {
        return res.status(500).json({
          error: "JSON parsing error",
          rawOutput: stdout,
          parseMessage: err.message,
        });
      }
    });
  } catch (err) {
    return res.status(500).json({
      error: "Server crashed in forecast route",
      details: err.message,
    });
  }
});

module.exports = router;
