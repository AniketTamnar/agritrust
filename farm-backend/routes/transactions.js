const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

/*
|--------------------------------------------------------------------------
| GET LOGGED-IN USER TRANSACTIONS
| Route: GET /api/transactions/my
|--------------------------------------------------------------------------
*/
router.get("/my", auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const transactions = await Transaction.find({ userId })
      .sort({ date: -1 })
      .lean();

    res.json(transactions);
  } catch (err) {
    console.error("❌ Error fetching user transactions:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

/*
|--------------------------------------------------------------------------
| GET TOTAL TRANSACTION AMOUNT (DASHBOARD)
| Route: GET /api/transactions/total/amount
|--------------------------------------------------------------------------
*/
router.get("/total/amount", auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const result = await Transaction.aggregate([
      {
        $match: { userId }, // ✅ ObjectId match (FIX)
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalAmount = result.length ? result[0].totalAmount : 0;

    res.json({ totalAmount });
  } catch (err) {
    console.error("❌ Error calculating total amount:", err);
    res.status(500).json({ error: "Failed to calculate total amount" });
  }
});

/*
|--------------------------------------------------------------------------
| GET SINGLE TRANSACTION (OWNER ONLY)
| Route: GET /api/transactions/:txId
| ⚠️ MUST BE LAST (to avoid route conflict)
|--------------------------------------------------------------------------
*/
router.get("/:txId", auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const transaction = await Transaction.findOne({
      txId: req.params.txId,
      userId,
    });

    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transaction not found or access denied" });
    }

    res.json(transaction);
  } catch (err) {
    console.error("❌ Error fetching transaction:", err);
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
});

module.exports = router;
