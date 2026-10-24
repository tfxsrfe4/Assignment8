const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator(value) {
          return !(value === value.toUpperCase() && value !== value.toLowerCase());
        },
        message: "Title must not be entirely uppercase"
      }
    },
    content: { type: String, required: true, trim: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("Note", noteSchema);
