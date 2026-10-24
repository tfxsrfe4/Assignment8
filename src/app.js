const express = require("express");
const userRoutes = require("./routes/user.routes");
const noteRoutes = require("./routes/note.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Sticky Notes API is running" });
});

app.use("/users", userRoutes);
app.use("/notes", noteRoutes);
app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use(errorHandler);

module.exports = app;
