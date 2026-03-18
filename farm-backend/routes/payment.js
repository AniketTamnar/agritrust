const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Razorpay = require("razorpay");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Transaction = require("../models/Transaction");
const sendEmail = require("../utils/sendEmail");
const auth = require("../middleware/auth");

// ===============================
// 🔑 RAZORPAY CONFIG
// ===============================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ===============================
// 🔐 OTP STORE (TEMP)
// ===============================
const otpStore = {};

// ----------------------------------------------------
// 📧 SEND OTP
// ----------------------------------------------------
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.json({ success: false, message: "Email required" });

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
    };

    await sendEmail(
      email,
      "AgriTrust OTP Verification",
      `Your OTP is: ${otp}`
    );

    res.json({ success: true });
  } catch (err) {
    console.error("OTP SEND ERROR:", err);
    res.json({ success: false, message: "Failed to send OTP" });
  }
});

// ----------------------------------------------------
// ✅ VERIFY OTP
// ----------------------------------------------------
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email])
    return res.json({ success: false, message: "OTP not sent" });

  if (Date.now() > otpStore[email].expires)
    return res.json({ success: false, message: "OTP expired" });

  if (otpStore[email].otp != otp)
    return res.json({ success: false, message: "Invalid OTP" });

  delete otpStore[email];
  res.json({ success: true });
});

// ----------------------------------------------------
// 🧾 CREATE RAZORPAY ORDER
// ----------------------------------------------------
router.post("/create-order", async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);
  } catch (err) {
    console.error("RAZORPAY CREATE ORDER ERROR:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
});

// ----------------------------------------------------
// 💳 VERIFY PAYMENT (ONLINE) + INVOICE EMAIL
// ----------------------------------------------------
router.post("/verify", auth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      form,
    } = req.body;

    const userId = req.user.id;

    // 1️⃣ VERIFY SIGNATURE
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSign !== razorpay_signature)
      return res.status(400).json({ error: "Invalid signature" });

    // 2️⃣ FETCH CART
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ error: "Cart empty" });

    const totalAmount = cart.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    // 3️⃣ SAVE ORDER
    const order = await Order.create({
      userId,
      paymentId: razorpay_payment_id,
      paymentMethod: "Razorpay",
      razorpayOrderId: razorpay_order_id,
      amount: totalAmount,
      items: cart.items,
      status: "Paid",
      date: new Date(),
      ...form,
    });

    // 4️⃣ SAVE TRANSACTION
    await Transaction.create({
      txId: razorpay_payment_id,
      orderId: order._id,
      userId,
      amount: totalAmount,
      items: cart.items,
      paymentMethod: "Razorpay",
      status: "Success",
    });

    // 5️⃣ CLEAR CART
    cart.items = [];
    await cart.save();

    // 6️⃣ GENERATE INVOICE PDF
    const invoiceDir = path.join(__dirname, "../invoices");
    if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);

    const invoicePath = path.join(
      invoiceDir,
      `invoice_${order._id}.pdf`
    );

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    doc.pipe(fs.createWriteStream(invoicePath));

    doc.fontSize(22).text("AgriTrust Invoice", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text("Customer Details", { underline: true });
    doc.fontSize(12)
      .text(`Name: ${form.name}`)
      .text(`Email: ${form.email}`)
      .text(`Phone: ${form.phone}`)
      .moveDown();

    doc.fontSize(14).text("Order Details", { underline: true });
    doc.fontSize(12)
      .text(`Order ID: ${order._id}`)
      .text(`Payment Method: Online`)
      .text(`Amount: ₹${totalAmount}`)
      .moveDown();

    order.items.forEach((i) => {
      doc.text(`${i.name} × ${i.quantity} = ₹${i.price * i.quantity}`);
    });

    doc.end();

    // 7️⃣ EMAIL INVOICE
    await sendEmail(
      form.email,
      "AgriTrust – Payment Successful (Invoice)",
      `Hello ${form.name},

Your payment was successful.
Please find your invoice attached.

Thank you for shopping with AgriTrust 🌱`,
      [{ filename: `invoice_${order._id}.pdf`, path: invoicePath }]
    );

    res.json({ success: true, order });
  } catch (err) {
    console.error("PAYMENT VERIFY ERROR:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

// ----------------------------------------------------
// 🚚 COD ORDER → INVOICE + EMAIL
// ----------------------------------------------------
router.post("/cod-invoice", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { form } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ error: "Cart empty" });

    const amount = cart.items.reduce(
      (s, i) => s + i.price * i.quantity,
      0
    );

    const paymentId = `COD-${Date.now()}`;

    const order = await Order.create({
      userId,
      paymentId,
      paymentMethod: "COD",
      items: cart.items,
      amount,
      status: "Pending",
      ...form,
    });

    await Transaction.create({
      txId: paymentId,
      orderId: order._id,
      userId,
      amount,
      items: cart.items,
      paymentMethod: "COD",
      status: "Success",
    });

    cart.items = [];
    await cart.save();

    // INVOICE PDF
    const invoiceDir = path.join(__dirname, "../invoices");
    if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);

    const invoicePath = path.join(
      invoiceDir,
      `invoice_${order._id}.pdf`
    );

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    doc.pipe(fs.createWriteStream(invoicePath));

    doc.fontSize(22).text("AgriTrust Invoice", { align: "center" });
    doc.moveDown();

    doc.fontSize(12)
      .text(`Order ID: ${order._id}`)
      .text(`Payment Method: Cash on Delivery`)
      .text(`Amount: ₹${amount}`)
      .moveDown();

    order.items.forEach((i) => {
      doc.text(`${i.name} × ${i.quantity} = ₹${i.price * i.quantity}`);
    });

    doc.end();

    await sendEmail(
      form.email,
      "AgriTrust – COD Order Invoice",
      `Hello ${form.name},

Your Cash on Delivery order has been placed successfully.
Invoice attached.

Thank you for shopping with AgriTrust 🌱`,
      [{ filename: `invoice_${order._id}.pdf`, path: invoicePath }]
    );

    res.json({ success: true, order });
  } catch (err) {
    console.error("COD INVOICE ERROR:", err);
    res.status(500).json({ error: "COD invoice failed" });
  }
});

module.exports = router;
