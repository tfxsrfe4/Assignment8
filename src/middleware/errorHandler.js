function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === 11000) {
    return res.status(409).json({ message: "Email already exists" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(err.errors).map((item) => item.message)
    });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID or value" });
  }

  return res.status(err.status || 500).json({
    message: err.status ? err.message : "Internal server error"
  });
}

module.exports = errorHandler;
