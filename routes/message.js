const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// ✅ POST route to save a new message
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    res
      .status(201)
      .json({ success: true, message: "Message saved successfully." });
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ error: "Server error." });
  }
});

// ✅ GET route to fetch all messages (for dashboard)
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
