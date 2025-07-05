import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

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

router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Server error." });
  }
});

export default router;
