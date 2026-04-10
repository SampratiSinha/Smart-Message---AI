const express = require("express");
const cors = require("cors");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for messages (in production, use a database)
let messages = [];

// API Routes

/**
 * POST /track
 * Track user actions and generate smart messages
 */
app.post("/track", (req, res) => {
  try {
    const { userId, action, product } = req.body;

    // Validate required fields
    if (!userId || !action) {
      return res.status(400).json({ error: "userId and action are required" });
    }

    // Generate personalized message based on action
    let message = "";
    switch (action) {
      case "add_to_cart":
        message = `🔥 Complete your purchase of ${product || "this item"} & get 10% OFF!`;
        break;
      case "view_product":
        message = `👀 Interested in ${product || "this product"}? Check out similar items!`;
        break;
      case "abandon_cart":
        message = `🛒 Your cart is waiting! Use code SAVE10 for 10% off.`;
        break;
      default:
        message = `💡 Thanks for your interest! Stay tuned for updates.`;
    }

    // Store the message
    const newMessage = {
      id: Date.now().toString(),
      userId,
      text: message,
      timestamp: new Date().toISOString(),
      action
    };
    messages.push(newMessage);

    res.status(200).json({ success: true, message: "Action tracked successfully" });
  } catch (error) {
    console.error("Error tracking action:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /messages/:userId
 * Retrieve messages for a specific user
 */
app.get("/messages/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const userMessages = messages.filter(msg => msg.userId === userId);

    res.status(200).json({
      userId,
      messages: userMessages,
      count: userMessages.length
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * DELETE /messages/:userId/:messageId
 * Delete a specific message
 */
app.delete("/messages/:userId/:messageId", (req, res) => {
  try {
    const { userId, messageId } = req.params;
    const initialLength = messages.length;
    messages = messages.filter(msg => !(msg.userId === userId && msg.id === messageId));

    if (messages.length < initialLength) {
      res.status(200).json({ success: true, message: "Message deleted" });
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /health
 * Health check endpoint
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SmartMsg AI Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});