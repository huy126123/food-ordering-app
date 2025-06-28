const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { fullName, username, email, password, role } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "User already in use." });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      username,
      email,
      password: hashed,
      role,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Register failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    res.json({
      user: { id: user._id, username: user.username, role: user.role },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
