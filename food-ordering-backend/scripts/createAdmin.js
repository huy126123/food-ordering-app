
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const MONGO_URI = process.env.MONGO_URI;

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const username = "admin";
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await User.findOne({ username });
    if (existing) {
      console.log("⚠️ Admin already exists");
      return;
    }

    const user = new User({
      username,
      password: hashedPassword,
      fullName: "Super Admin",
      email:"quangleomx@gmail.com",
      role: "admin",
    });

    await user.save();
    console.log("✅ Admin created successfully:", user);
  } catch (err) {
    console.error("❌ Failed to create admin:", err);
  } finally {
    mongoose.disconnect();
  }
};

createAdmin();
