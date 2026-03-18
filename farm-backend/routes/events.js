const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const auth = require("../middleware/auth");

// ----------------------------------------------------
// GET ALL EVENTS ONLY FOR LOGGED-IN USER
// ----------------------------------------------------
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const events = await Event.find({ userId }).sort({ date: 1 });

    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------------------------------------
// ADD NEW EVENT (User-specific)
// ----------------------------------------------------
router.post("/", auth, async (req, res) => {
  try {
    const { title, date, repeat } = req.body;

    if (!title || !date) {
      return res.status(400).json({ error: "Title and Date are required" });
    }

    const newEvent = new Event({
      userId: req.user.id,
      title,
      date,
      repeat: repeat || "none",
    });

    await newEvent.save();
    res.json(newEvent);
  } catch (err) {
    console.error("Error saving event:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------------------------------------
// UPDATE EVENT  (Only owner can edit)
// ----------------------------------------------------
router.put("/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const updated = await Event.findOneAndUpdate(
      { _id: req.params.id, userId }, // must belong to user
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ error: "Event not found or not authorized" });

    res.json(updated);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------------------------------------
// DELETE EVENT  (Only owner can delete)
// ----------------------------------------------------
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const deleted = await Event.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!deleted)
      return res.status(404).json({ error: "Event not found or not authorized" });

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
