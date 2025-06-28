require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user");

const MONGO_URI = process.env.MONGO_URI;

const deleteAllUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const result = await User.deleteMany({});
    console.log(`🗑️ Deleted ${result.deletedCount} user(s).`);
  } catch (err) {
    console.error("❌ Failed to delete users:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
  }
};

deleteAllUsers();