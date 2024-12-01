







// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/auth");
// const transactionRoutes = require("./routes/transaction");
// const { Server } = require("socket.io");

// // Load environment variables
// dotenv.config();

// // Check if STRIPE_SECRET_KEY is loaded
// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error("STRIPE_SECRET_KEY is not defined in the environment.");
// }

// // Connect to the database
// connectDB();

// // Initialize Express app
// const app = express();
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/transactions", transactionRoutes);

// // Start server
// const PORT = process.env.PORT || 5000;
// const server = app.listen(PORT, () =>
//   console.log(`Server running on port ${PORT}`)
// );

// // Initialize Socket.IO
// const io = new Server(server, { cors: { origin: "*" } });

// io.on("connection", (socket) => {
//   console.log("New client connected");
//   socket.on("newTransaction", (data) => {
//     io.emit("transactionUpdate", data);
//   });
// });



























































const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transaction");
const { Server } = require("socket.io");
const http = require("http"); // Import HTTP module for server creation

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
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("New client connected");

  // Listen for a new transaction event
  socket.on("newTransaction", (data) => {
    console.log("New transaction received:", data);

    // Broadcast the new transaction to all connected clients
    io.emit("transactionUpdate", data);
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the HTTP server
httpServer.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
