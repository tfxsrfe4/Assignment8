const express = require("express");
const controller = require("../controllers/user.controller");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/signup", asyncHandler(controller.signup));
router.post("/login", asyncHandler(controller.login));
router.patch("/:id", asyncHandler(controller.updateUser));
router.delete("/", asyncHandler(controller.deleteUser));
router.get("/", asyncHandler(controller.getUser));

module.exports = router;
