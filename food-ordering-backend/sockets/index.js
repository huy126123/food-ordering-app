module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("join", (roomId) => {
      socket.join(roomId);
    });

    socket.on("leave", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });
};
