const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const nodemailer = require("nodemailer");

// EMAIL TRANSPORTER
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// -------------------------------------------------------
// VALIDATION HELPERS
// -------------------------------------------------------
const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
const isValidOtp = (otp) => /^\d{6}$/.test(otp);

// -------------------------------------------------------
// SIGNUP
// -------------------------------------------------------
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      failedAttempts: 0,
      lockUntil: null,
      lastOtpSent: null,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------------------------------------
// LOGIN (SEND OTP)
// -------------------------------------------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    let user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    // ACCOUNT LOCK CHECK
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({
        message: "Account locked. Try again later.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.failedAttempts += 1;

      // Lock account after 5 failed attempts
      if (user.failedAttempts >= 5) {
        user.lockUntil = Date.now() + 10 * 60 * 1000; // 10 minutes
        user.failedAttempts = 0;
      }

      await user.save();
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // RESET FAILED ATTEMPTS
    user.failedAttempts = 0;

    // OTP COOLDOWN -> 1 OTP per minute
    if (user.lastOtpSent && Date.now() - user.lastOtpSent < 60000) {
      return res.status(429).json({
        message: "Please wait 1 minute before requesting a new OTP.",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.lastOtpSent = Date.now();
    await user.save();

    // Send OTP Email
    await transporter.sendMail({
      from: `AgriTrust <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your AgriTrust Login OTP",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    res.json({ message: "OTP sent to email", email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------------------------------------
// VERIFY OTP
// -------------------------------------------------------
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email" });

    if (!isValidOtp(otp))
      return res.status(400).json({ message: "Invalid OTP format" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpires < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    // Clear OTP Data
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "OTP Verified",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------------------------------------
// FARMER COUNT
// -------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch farmer count" });
  }
});

// -------------------------------------------------------
// LOGGED-IN USER INFO
// -------------------------------------------------------
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
