// // server.js
// const express = require('express');
// const jwt = require('jsonwebtoken');
// const rateLimit = require('express-rate-limit');
// const cors = require('cors');
// const mongoose = require('mongoose');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// // Transaction Schema
// const transactionSchema = new mongoose.Schema({
//   transactionId: { type: String, required: true, unique: true },
//   amount: { type: Number, required: true },
//   type: { type: String, enum: ['credit', 'debit'], required: true },
//   status: { type: String, enum: ['successful', 'pending', 'failed'], required: true },
//   date: { type: Date, default: Date.now },
//   description: String,
//   userId: String
// }, { timestamps: true });

// const Transaction = mongoose.model('Transaction', transactionSchema);


// // yser schema
// const bcrypt = require('bcryptjs');
// const userSchema = new mongoose.Schema({
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     name: { type: String, required: true },
//     role: { type: String, default: 'user' }
//   });
  
//   userSchema.pre('save', async function(next) {
//     if (this.isModified('password')) {
//       this.password = await bcrypt.hash(this.password, 10);
//     }
//     next();
//   });
  
//   const User = mongoose.model('UserData', userSchema);
// // Authentication middleware
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) return res.sendStatus(401);

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };



// // Routes
// app.post('/register', async (req, res) => {
//     try {
//         const { email, password, name } = req.body;

//         // Validate input
//         if (!email || !password || !name) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         // Check for existing user
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         // Create new user
//         const user = new User({ email, password, name });
//         await user.save();

//         // Generate token
//         const token = jwt.sign(
//             { userId: user._id, email: user.email },
//             process.env.JWT_SECRET,
//             { expiresIn: '24h' }
//         );

//         res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating user', error: error.message });
//     }
// });




// app.post('/login', async (req, res) => {
//     try {
//         const { email, password, name } = req.body;
        
//         // Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//           return res.status(400).json({ message: 'User already exists' });
//         }
    
//         // Create new user
//         const user = new User({
//           email,
//           password,
//           name
//         });
    
//         await user.save();
    
//         // Generate token
//         const token = jwt.sign(
//           { userId: user._id, email: user.email },
//           process.env.JWT_SECRET,
//           { expiresIn: '24h' }
//         );
    
//         res.status(201).json({
//           token,
//           user: {
//             id: user._id,
//             email: user.email,
//             name: user.name
//           }
//         });
//       } catch (error) {
//         res.status(500).json({ message: 'Error creating user', error: error.message });
//       }
//     });
    
//     // Login endpoint
//     app.post('/login', async (req, res) => {
//       try {
//         const { email, password } = req.body;
    
//         // Find user
//         const user = await User.findOne({ email });
//         if (!user) {
//           return res.status(401).json({ message: 'Invalid credentials' });
//         }
    
//         // Verify password
//         const isValidPassword = await bcrypt.compare(password, user.password);
//         if (!isValidPassword) {
//           return res.status(401).json({ message: 'Invalid credentials' });
//         }
    
//         // Generate token
//         const token = jwt.sign(
//           { userId: user._id, email: user.email },
//           process.env.JWT_SECRET,
//           { expiresIn: '24h' }
//         );
    
//         res.json({
//           token,
//           user: {
//             id: user._id,
//             email: user.email,
//             name: user.name
//           }
//         });
//       } catch (error) {
//         res.status(500).json({ message: 'Error logging in', error: error.message });
//       }

// })






// app.get('/api/transactions', authenticateToken, async (req, res) => {
//   try {
//     const { page = 1, limit = 10, startDate, endDate, type, status } = req.query;
//     const query = {};

//     if (startDate && endDate) {
//       query.date = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate)
//       };
//     }

//     if (type) query.type = type;
//     if (status) query.status = status;

//     const transactions = await Transaction.find(query)
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .sort({ date: -1 });

//     const count = await Transaction.countDocuments(query);

//     res.json({
//       transactions,
//       totalPages: Math.ceil(count / limit),
//       currentPage: page
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.get('/api/transactions/:id', authenticateToken, async (req, res) => {
//   try {
//     const transaction = await Transaction.findOne({ transactionId: req.params.id });
//     if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
//     res.json(transaction);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.get('/api/summary', authenticateToken, async (req, res) => {
//   try {
//     const summary = await Transaction.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalAmount: { $sum: '$amount' },
//           avgAmount: { $avg: '$amount' },
//           totalCount: { $sum: 1 },
//           successCount: {
//             $sum: { $cond: [{ $eq: ['$status', 'successful'] }, 1, 0] }
//           },
//           pendingCount: {
//             $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
//           },
//           failedCount: {
//             $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
//           }
//         }
//       }
//     ]);

//     res.json(summary[0]);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // WebSocket setup for real-time updates
// const WebSocket = require('ws');
// const server = require('http').createServer(app);
// const wss = new WebSocket.Server({ server });

// wss.on('connection', (ws) => {
//   ws.on('message', (message) => {
//     // Handle incoming messages if needed
//   });
// });

// // Broadcast new transactions to all connected clients
// const broadcastTransaction = (transaction) => {
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify(transaction));
//     }
//   });
// };

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


















































































// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/auth");
// const transactionRoutes = require("./routes/transaction");

// dotenv.config();
// connectDB();

// const { Server } = require("socket.io");

// const io = new Server(server, { cors: { origin: "*" } });

// io.on("connection", (socket) => {
//   console.log("New client connected");
//   socket.on("newTransaction", (data) => {
//     io.emit("transactionUpdate", data);
//   });
// });


// const app = express();
// app.use(cors());
// app.use(express.json());



// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/transactions", transactionRoutes);

// const server = app.listen(process.env.PORT, () =>
//   console.log(`Server running on port ${process.env.PORT}`)
// );





































































































const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transaction");
const { Server } = require("socket.io");

// Load environment variables
dotenv.config();

// Check if STRIPE_SECRET_KEY is loaded
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in the environment.");
}

// Connect to the database
connectDB();

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

// Initialize Socket.IO
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("newTransaction", (data) => {
    io.emit("transactionUpdate", data);
  });
});
