const mongoose = require("mongoose");
const Note = require("../models/Note");

function requireUserId(req, res) {
  const userId = req.query.userId;
  if (!userId) {
    res.status(400).json({ message: "userId query parameter is required" });
    return null;
  }
  if (!mongoose.isValidObjectId(userId)) {
    res.status(400).json({ message: "Invalid userId" });
    return null;
  }
  return userId;
}

exports.createNote = async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const { title, content } = req.body;
  const note = await Note.create({ title, content, userId });
  return res.status(201).json({ message: "Note created successfully", note });
};

exports.updateNote = async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const updates = {};
  for (const field of ["title", "content"]) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  const note = await Note.findOneAndUpdate(
    { _id: req.params.noteId, userId },
    updates,
    { new: true, runValidators: true }
  );
  if (!note) return res.status(404).json({ message: "Note not found for this user" });
  return res.json({ message: "Note updated successfully", note });
};

exports.replaceNote = async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const { title, content } = req.body;
  const note = await Note.findOneAndReplace(
    { _id: req.params.noteId, userId },
    { title, content, userId },
    { new: true, runValidators: true }
  );
  if (!note) return res.status(404).json({ message: "Note not found for this user" });
  return res.json({ message: "Note replaced successfully", note });
};

exports.updateAllTitles = async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;
  if (!req.body.title) return res.status(400).json({ message: "title is required" });

  const result = await Note.updateMany(
    { userId },
    { $set: { title: req.body.title } },
    { runValidators: true }
  );
  return res.json({
    message: "Titles updated successfully",
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount
  });
};

exports.deleteNote = async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const note = await Note.findOneAndDelete({ _id: req.params.noteId, userId });
  if (!note) return res.status(404).json({ message: "Note not found for this user" });
  return res.json({ message: "Note deleted successfully", note });
};

exports.paginateSort = async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const [notes, total] = await Promise.all([
    Note.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Note.countDocuments({ userId })
  ]);

  return res.json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    notes
  });
};

exports.getNoteById = async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const note = await Note.findOne({ _id: req.params.id, userId });
  if (!note) return res.status(404).json({ message: "Note not found for this user" });
  return res.json({ note });
};

exports.getNotesByContent = async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const content = req.query.content;
  if (content === undefined) return res.status(400).json({ message: "content query parameter is required" });

  const notes = await Note.find({ userId, content });
  return res.json({ count: notes.length, notes });
};

exports.notesWithUser = async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const notes = await Note.find({ userId })
    .select("title userId createdAt")
    .populate({ path: "userId", select: "email -_id" });
  return res.json({ count: notes.length, notes });
};

exports.aggregateNotes = async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const match = { userId: new mongoose.Types.ObjectId(userId) };
  if (req.query.title) {
    match.title = { $regex: String(req.query.title), $options: "i" };
  }

  const notes = await Note.aggregate([
    { $match: match },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $project: {
        title: 1,
        content: 1,
        userId: 1,
        createdAt: 1,
        updatedAt: 1,
        "user.name": 1,
        "user.email": 1
      }
    },
    { $sort: { createdAt: -1 } }
  ]);

  return res.json({ count: notes.length, notes });
};

exports.deleteAllNotes = async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const result = await Note.deleteMany({ userId });
  return res.json({
    message: "All notes deleted successfully",
    deletedCount: result.deletedCount
  });
};
