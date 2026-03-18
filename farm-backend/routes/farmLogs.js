const express = require("express");
const router = express.Router();
const FarmLog = require("../models/FarmLog");
const auth = require("../middleware/auth");

// Create a new farm log
router.post("/", auth, async (req, res) => {
  try {
    const farmLog = new FarmLog({
      ...req.body,
      ownerId: req.user.id, // store the creator
    });
    await farmLog.save();
    res.status(201).json(farmLog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all farm logs (only public + user's own private logs)
router.get("/", auth, async (req, res) => {
  try {
    const logs = await FarmLog.find({
      $or: [{ isPublic: true }, { ownerId: req.user.id }],
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single farm log by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const log = await FarmLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: "Log not found" });

    // Only owner or public can view
    if (!log.isPublic && String(log.ownerId) !== String(req.user.id))
      return res.status(403).json({ message: "Access denied" });

    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a farm log (only owner)
router.delete("/:id", auth, async (req, res) => {
  try {
    const log = await FarmLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: "Log not found" });

    if (String(log.ownerId) !== String(req.user.id))
      return res.status(403).json({ message: "Only owner can delete" });

    await log.deleteOne();
    res.json({ message: "Log deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle public/private (only owner)
router.patch("/:id", auth, async (req, res) => {
  try {
    const log = await FarmLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: "Log not found" });

    if (String(log.ownerId) !== String(req.user.id))
      return res.status(403).json({ message: "Only owner can change visibility" });

    log.isPublic = req.body.isPublic;
    await log.save();

    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
