const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

/*
|--------------------------------------------------------------------------
| ADD NEW PRODUCT (FARMER ONLY)
|--------------------------------------------------------------------------
*/
router.post("/", auth, async (req, res) => {
  try {
    const farmerId = req.user.id;

    const {
      name,
      grainType,
      price,
      quantity,
      location,
      image,
      description,
    } = req.body;

    const product = await Product.create({
      farmerId,
      name,
      grainType,
      price,
      quantity: quantity ?? 1,
      location,
      image,
      description,
    });

    res.json({ message: "✅ Product added", product });
  } catch (err) {
    console.error("Add Product Error:", err);
    res.status(500).json({ message: "Product creation failed" });
  }
});

/*
|--------------------------------------------------------------------------
| GET ALL PRODUCTS (PUBLIC)
|--------------------------------------------------------------------------
*/
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Fetch Products Error:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

/*
|--------------------------------------------------------------------------
| UPDATE PRODUCT QUANTITY (OWNER ONLY)
|--------------------------------------------------------------------------
*/
router.put("/:id", auth, async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;
    const { quantity } = req.body;

    if (quantity < 0)
      return res.status(400).json({ message: "Quantity cannot be negative" });

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // 🔐 OWNER CHECK
    if (String(product.farmerId) !== String(userId))
      return res.status(403).json({ message: "Not authorized" });

    product.quantity = quantity;
    await product.save();

    res.json({ message: "✅ Quantity updated", product });
  } catch (err) {
    console.error("Update Quantity Error:", err);
    res.status(500).json({ message: "Failed to update quantity" });
  }
});

/*
|--------------------------------------------------------------------------
| DELETE PRODUCT (OWNER ONLY)
|--------------------------------------------------------------------------
*/
router.delete("/:id", auth, async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // 🔐 OWNER CHECK
    if (String(product.farmerId) !== String(userId))
      return res.status(403).json({ message: "Not authorized" });

    await Product.deleteOne({ _id: productId });

    res.json({ message: "✅ Product deleted" });
  } catch (err) {
    console.error("Delete Product Error:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

module.exports = router;
