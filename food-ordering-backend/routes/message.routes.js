const express = require("express");
const router = express.Router();
const Message = require("../models/message");

router.get("/:orderId", async (req, res) => {
  try {
    const messages = await Message.find({ orderId: req.params.orderId }).sort({
      timestamp: 1,
    });
    res.json(messages);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get messages", error: err.message });
  }
});

module.exports = router;
