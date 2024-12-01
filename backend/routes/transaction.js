const express = require("express");
const Transaction = require("../model/transaction");
const { authenticate } = require("../middleware/auth");
const stripe = require("stripe")('sk_test_51Q7ZmIP8a9YwaGKMYiaRiWC3iBoYymkTqqdy3cWNlIBgfs0g4zDKqhnxG1OL8ITvPurW3rVUk6Oe38h8IIMJC1gD00pHMZcOiC');
require('dotenv').config();

const router = express.Router();
console.log(process.env.STRIPE_SECRET_KEY);





// router.get("/summery", authenticate, async (req, res) => {
//   const { page = 1, limit = 10, status, type, startDate, endDate } = req.query;
//   const filter = {};

//   // Add filters only if they have valid values
//   if (status) filter.status = status;
//   if (type) filter.type = type;
//   if (startDate && endDate) {
//     filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
//   }

//   try {
//     const transactions = await Transaction.find(filter)
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     res.json(transactions);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch transactions" });
//   }
// });






router.get("/summery", authenticate, async (req, res) => {
  const { page = 1, limit = 10, status, type, startDate, endDate } = req.query;

  const filter = {};
  // Apply filters only if provided
  if (status) filter.status = status;
  if (type) filter.type = type;
  if (startDate && endDate) {
    filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  try {
    const transactions = await Transaction.find(filter)
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));
    const total = await Transaction.countDocuments(filter);

    res.json({ transactions, total });
  } catch (err) {
    console.error("Failed to fetch transactions:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

module.exports = router;












// // Fetch Transactions
// router.get("/summery", authenticate, async (req, res) => {
//   const { page = 1, limit = 10, status, type, startDate, endDate } = req.query;
//   const filter = {};

//   if (status) filter.status = status;
//   if (type) filter.type = type;
//   if (startDate && endDate) {
//     filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
//   }

//   const transactions = await Transaction.find(filter)
//     .skip((page - 1) * limit)
//     .limit(Number(limit));
//   res.json(transactions);
// });

// Create Transaction
router.post("/transfer", authenticate, async (req, res) => {
  const { sender, receiver, amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses smallest currency unit
      currency: "usd",
      payment_method_types: ["card"],
    });

    const transaction = await Transaction.create({
      sender,
      receiver,
      amount,
      status: "successful",
      type: "debit",
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});







module.exports = router;
