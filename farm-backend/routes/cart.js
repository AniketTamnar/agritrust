const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

// -------------------------------------------------------
// 🟢 GET USER CART
// -------------------------------------------------------
router.get("/", auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ userId, items: [] });

    res.json(cart);
  } catch (err) {
    console.error("❌ Cart fetch error:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// -------------------------------------------------------
// 🟢 ADD ITEM TO CART (🔻 DECREASE STOCK)
// -------------------------------------------------------
router.post("/add", auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID required" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.quantity < quantity) {
      return res.status(400).json({ error: "Out of stock" });
    }

    // 🔻 DECREASE PRODUCT STOCK
    product.quantity -= quantity;
    await product.save();

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = await Cart.create({ userId, items: [] });

    const existing = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
      });
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    console.error("❌ Add to cart error:", err);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// -------------------------------------------------------
// 🟡 UPDATE ITEM QUANTITY (SYNC STOCK)
// -------------------------------------------------------
router.put("/update-qty", auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { productId, change } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );
    if (!item) return res.status(404).json({ error: "Item not found" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // 🔺 increase qty → reduce stock
    if (change > 0) {
      if (product.quantity < change) {
        return res.status(400).json({ error: "Insufficient stock" });
      }
      product.quantity -= change;
    }

    // 🔻 decrease qty → restore stock
    if (change < 0) {
      product.quantity += Math.abs(change);
    }

    item.quantity += change;

    if (item.quantity <= 0) {
      cart.items = cart.items.filter(
        (i) => i.productId.toString() !== productId
      );
    }

    await product.save();
    await cart.save();

    res.json({ success: true, cart });
  } catch (err) {
    console.error("❌ Update qty error:", err);
    res.status(500).json({ error: "Failed to update quantity" });
  }
});

// -------------------------------------------------------
// 🔴 DELETE SINGLE ITEM (🔺 RESTORE STOCK)
// -------------------------------------------------------
router.delete("/delete-item", auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    if (item) {
      const product = await Product.findById(productId);
      if (product) {
        product.quantity += item.quantity; // 🔺 RESTORE
        await product.save();
      }
    }

    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId
    );

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    console.error("❌ Delete item error:", err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// -------------------------------------------------------
// 🧹 CLEAR CART (🔺 RESTORE ALL STOCK)
// -------------------------------------------------------
router.delete("/", auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ success: true });

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }

    cart.items = [];
    await cart.save();

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Clear cart error:", err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

module.exports = router;
