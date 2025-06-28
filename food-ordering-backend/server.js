const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const socketIO = require("socket.io");

const authRoutes = require("./routes/auth.routes");
const menuRoutes = require("./routes/menu.routes");
const orderRoutes = require("./routes/order.routes");
const messageRoutes = require("./routes/message.routes");
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});
app.set("io", io);

require("./sockets")(io);
require("./sockets/chat")(io);

app.use(cors());
app.use(express.json());

app.use("/api/messages", messageRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error", err));

app.get("/", (req, res) => res.send("API is running..."));

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
