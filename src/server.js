require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error.message);
    process.exit(1);
  });
