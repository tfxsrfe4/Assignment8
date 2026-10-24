const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Note = require("../models/Note");

exports.signup = async (req, res) => {
  const { name, email, password, phone, age } = req.body;
  const normalizedEmail = String(email || "").trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(String(password || ""), 10);
  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    phone,
    age
  });

  return res.status(201).json({
    message: "User created successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      age: user.age
    }
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email: String(email || "").trim().toLowerCase()
  }).select("+password");

  if (!user || !(await bcrypt.compare(String(password || ""), user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  return res.status(200).json({
    message: "Login successful",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      age: user.age
    }
  });
};

exports.updateUser = async (req, res) => {
  const userId = req.query.userId;
  if (!userId || userId !== req.params.id) {
    return res.status(403).json({ message: "You can update only your own user ID" });
  }

  const allowedFields = ["name", "email", "phone", "age"];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  if (updates.email) {
    updates.email = String(updates.email).trim().toLowerCase();
    const existing = await User.findOne({
      email: updates.email,
      _id: { $ne: userId }
    });
    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }
  }

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true
  }).select("-password");

  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ message: "User updated successfully", user });
};

exports.deleteUser = async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ message: "userId query parameter is required" });

  const user = await User.findByIdAndDelete(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  await Note.deleteMany({ userId });
  return res.json({
    message: "User and their notes deleted successfully",
    user: { _id: user._id, name: user.name, email: user.email }
  });
};

exports.getUser = async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ message: "userId query parameter is required" });

  const user = await User.findById(userId).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user });
};
