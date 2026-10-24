const express = require("express");
const controller = require("../controllers/note.controller");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/", asyncHandler(controller.createNote));
router.patch("/all", asyncHandler(controller.updateAllTitles));
router.get("/paginate-sort", asyncHandler(controller.paginateSort));
router.get("/note-by-content", asyncHandler(controller.getNotesByContent));
router.get("/note-with-user", asyncHandler(controller.notesWithUser));
router.get("/aggregate", asyncHandler(controller.aggregateNotes));
router.delete("/", asyncHandler(controller.deleteAllNotes));

router.put("/replace/:noteId", asyncHandler(controller.replaceNote));
router.patch("/:noteId", asyncHandler(controller.updateNote));
router.delete("/:noteId", asyncHandler(controller.deleteNote));
router.get("/:id", asyncHandler(controller.getNoteById));

module.exports = router;
