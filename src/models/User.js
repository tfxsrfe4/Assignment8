const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true, trim: true },
    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
      max: [60, "Age must not be greater than 60"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
