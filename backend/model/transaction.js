const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["successful", "failed", "pending"], default: "pending" },
  type: { type: String, enum: ["credit", "debit"], required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
