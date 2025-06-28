const Message = require("../models/message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 [Chat] Socket connected:", socket.id);

    socket.on("join-order", (orderId) => {
      socket.join(orderId);
    });
    socket.on("leave", (roomId) => {
      socket.leave(roomId);
    });
    socket.on("send-message", async (data) => {
      const { orderId, senderId, content } = data;

      if (!orderId || !senderId || !content) return;

      const message = await Message.create({ orderId, senderId, content });

      io.to(orderId).emit("receive-message", message);
    });

    socket.on("disconnect", () => {
      console.log("🔴 [Chat] Socket disconnected:", socket.id);
    });
  });
};
