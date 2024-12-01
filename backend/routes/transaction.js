const express = require("express");
const Transaction = require("../model/transaction");
const { authenticate } = require("../middleware/auth");
const stripe = require("stripe")('sk_test_51Q7ZmIP8a9YwaGKMYiaRiWC3iBoYymkTqqdy3cWNlIBgfs0g4zDKqhnxG1OL8ITvPurW3rVUk6Oe38h8IIMJC1gD00pHMZcOiC');
require('dotenv').config();

const router = express.Router();
//console.log(process.env.STRIPE_SECRET_KEY);





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



// router.post("/transfer", authenticate, async (req, res) => {
//   const { sender, receiver, amount } = req.body;
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount * 100, // Stripe uses smallest currency unit
//       currency: "usd",
//       payment_method_types: ["card"],
//     });

//     const transaction = await Transaction.create({
//       sender,
//       receiver,
//       amount,
//       status: "successful",
//       type: "debit",
//     });

//     res.status(201).json(transaction);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
const { io } = require("../server");

router.post("/transfer", authenticate, async (req, res) => {
  const { sender, receiver, amount } = req.body;
  try {
    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses the smallest currency unit (e.g., cents for USD)
      currency: "usd",
      payment_method_types: ["card"],
    });

    // Create a transaction record in the database
    const transaction = await Transaction.create({
      sender,
      receiver,
      amount,
      status: "successful",
      type: "debit",
    });

    // Emit a socket event to notify the recipient about the transaction
    io.to(receiver).emit("newTransaction", {
      sender: sender, 
      receiver: receiver,
      amount: amount,
      message: `You have received ${amount} from ${sender.name}`,
    });

    // Send the response back with the transaction details
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



























router.get("/transaction",authenticate,  async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      {
        $group: {
          _id: null, // Groups all transactions
          totalVolume: { $sum: "$amount" }, // Total sum of transaction amounts
          totalTransactions: { $sum: 1 }, // Total number of transactions
          avgTransactionSize: { $avg: "$amount" }, // Average transaction size
          totalSenders: { $addToSet: "$sender" }, // Unique senders
          totalReceivers: { $addToSet: "$receiver" }, // Unique receivers
          successfulCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "successful"] }, 1, 0],
            },
          },
          pendingCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
            },
          },
          failedCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "failed"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0, // Exclude group ID from result
          totalVolume: 1,
          totalTransactions: 1,
          avgTransactionSize: 1,
          totalUsers: {
            $size: { $setUnion: ["$totalSenders", "$totalReceivers"] }, // Unique users count
          },
          statusBreakdown: {
            successful: "$successfulCount",
            pending: "$pendingCount",
            failed: "$failedCount",
          },
        },
      },
    ]);

    res.status(200).json(summary[0] || {
      totalVolume: 0,
      totalTransactions: 0,
      avgTransactionSize: 0,
      totalUsers: 0,
      statusBreakdown: {
        successful: 0,
        pending: 0,
        failed: 0,
      },
    });
  } catch (error) {
    console.error("Error fetching transaction summary:", error);
    res.status(500).json({ error: "Failed to fetch all transaction summary." });
  }
});











module.exports = router;
