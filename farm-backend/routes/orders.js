const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");

const Order = require("../models/Order");
const CancelledOrder = require("../models/CancelledOrder");
const Transaction = require("../models/Transaction");
const Cart = require("../models/Cart");
const auth = require("../middleware/auth");

// ===============================
// 🔑 RAZORPAY CONFIG
// ===============================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ===============================
// 📧 EMAIL CONFIG
// ===============================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ===============================
// ❌ CANCEL REASONS
// ===============================
const cancelReasons = [
  { id: 1, title: "Ordered by mistake" },
  { id: 2, title: "Found cheaper elsewhere" },
  { id: 3, title: "Delivery delay" },
  { id: 4, title: "Change of mind" },
  { id: 10, title: "Other" },
];

// ===============================
// 📋 GET CANCEL REASONS
// ===============================
router.get("/cancel-reasons", auth, (req, res) => {
  res.json(cancelReasons);
});

// ===============================
// 🚚 PLACE COD ORDER
// ===============================
router.post("/cod", auth, async (req, res) => {
  try {
    const { form } = req.body;
    if (!form?.email || !form?.address)
      return res.status(400).json({ message: "Missing details" });

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart empty" });

    const amount = cart.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    const paymentId = `COD-${Date.now()}`;

    const order = await Order.create({
      userId: req.user.id,
      items: cart.items,
      amount,
      paymentId,
      paymentMethod: "COD",
      ...form,
      status: "Pending",
    });

    await Transaction.create({
      userId: req.user.id,
      txId: paymentId,
      orderId: order._id,
      items: cart.items,
      amount,
      paymentMethod: "COD",
      status: "Success",
    });

    cart.items = [];
    await cart.save();

    res.json({ success: true, order });
  } catch (err) {
    console.error("❌ COD error:", err);
    res.status(500).json({ message: "COD failed" });
  }
});

// ===============================
// 💳 PLACE ONLINE (RAZORPAY) ORDER
// ===============================
router.post("/place", auth, async (req, res) => {
  try {
    const {
      items,
      amount,
      paymentId,
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
    } = req.body;

    if (!paymentId)
      return res.status(400).json({ message: "paymentId missing" });

    const order = await Order.create({
      userId: req.user.id,
      items,
      amount,
      paymentId,
      paymentMethod: "Razorpay",
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      status: "Paid",
    });

    await Transaction.create({
      userId: req.user.id,
      txId: paymentId,
      orderId: order._id,
      items,
      amount,
      paymentMethod: "Razorpay",
      status: "Success",
    });

    res.json({ success: true, order });
  } catch (err) {
    console.error("❌ Online order error:", err);
    res.status(500).json({ message: "Order failed" });
  }
});

// ==================================================
// ❌ CANCEL ORDER (COD + ONLINE + EMAIL)
// ==================================================
router.post("/:id/cancel", auth, async (req, res) => {
  try {
    const { reasonId, note } = req.body;
    if (!reasonId)
      return res.status(400).json({ message: "Cancel reason required" });

    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Order not found" });

    if (String(order.userId) !== String(req.user.id))
      return res.status(403).json({ message: "Unauthorized" });

    if (order.status === "Cancelled")
      return res.status(400).json({ message: "Order already cancelled" });

    const reason =
      cancelReasons.find((r) => r.id === Number(reasonId)) ||
      cancelReasons[cancelReasons.length - 1];

    let refundStatus = "Not required";

    // 🔥 RAZORPAY REFUND
    if (order.paymentMethod === "Razorpay") {
      try {
        await razorpay.payments.refund(order.paymentId, {
          amount: order.amount * 100,
        });
        refundStatus = "Initiated";
      } catch (err) {
        console.error("❌ Razorpay refund error:", err);
        return res
          .status(400)
          .json({ message: "Refund failed. Cannot cancel order." });
      }
    }

    // ✅ SAVE CANCELLED ORDER
    await CancelledOrder.create({
      orderId: order._id,
      userId: req.user.id,
      reasonId: Number(reasonId),
      reasonText: reason.title,
      note: note || "",
      cancelledBy: "user",
      cancelledAt: new Date(),
      refundStatus,
      orderSnapshot: order.toObject(),
    });

    // ✅ UPDATE ORDER
    order.status = "Cancelled";
    await order.save();

    // ✅ UPDATE TRANSACTION (SAFE)
    await Transaction.findOneAndUpdate(
      { orderId: order._id },
      { status: "Cancelled", refundStatus },
      { upsert: true }
    );

    // ===============================
    // 📧 SEND HTML CANCEL EMAIL
    // ===============================
    const html = `
      <h2 style="color:#10b981">AgriTrust – Order Cancelled</h2>
      <p>Hello <b>${order.name}</b>,</p>
      <p>Your order <b>${order._id}</b> has been cancelled.</p>
      <p><b>Payment Method:</b> ${order.paymentMethod}</p>
      <p><b>Amount:</b> ₹${order.amount}</p>
      ${
        order.paymentMethod === "Razorpay"
          ? `<p><b>Refund Status:</b> ${refundStatus}<br/>Refund in 3–5 working days.</p>`
          : `<p>No payment was charged (COD).</p>`
      }
      <p>Thank you for shopping with AgriTrust 🌱</p>
    `;

    await transporter.sendMail({
      from: `"AgriTrust" <${process.env.EMAIL_USER}>`,
      to: order.email,
      subject:
        order.paymentMethod === "Razorpay"
          ? "AgriTrust – Order Cancelled & Refund Initiated"
          : "AgriTrust – Order Cancelled",
      html,
    });

    res.json({
      success: true,
      message:
        order.paymentMethod === "Razorpay"
          ? "Order cancelled. Refund initiated."
          : "Order cancelled successfully",
    });
  } catch (err) {
    console.error("❌ Cancel error:", err);
    res.status(500).json({ message: "Cancel failed" });
  }
});

// ===============================
// 📦 USER ACTIVE ORDERS
// ===============================
router.get("/user/:userId", auth, async (req, res) => {
  if (String(req.user.id) !== String(req.params.userId))
    return res.status(403).json({ message: "Unauthorized" });

  const orders = await Order.find({
    userId: req.user.id,
    status: { $ne: "Cancelled" },
  }).sort({ createdAt: -1 });

  res.json(orders);
});

// ===============================
// ❌ USER CANCELLED ORDERS
// ===============================
router.get("/cancelled/user/:userId", auth, async (req, res) => {
  if (String(req.user.id) !== String(req.params.userId))
    return res.status(403).json({ message: "Unauthorized" });

  const cancelled = await CancelledOrder.find({
    userId: req.user.id,
  }).sort({ cancelledAt: -1 });

  res.json(cancelled);
});

module.exports = router;
