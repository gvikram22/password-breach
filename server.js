require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const connectDB = require("./config/db");
const passwordRoutes = require("./routes/passwordRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const logger = require("./middleware/logger");

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "10kb" }));
app.use(logger);
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/password", rateLimit({ windowMs: 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false }));
app.use("/api/password", passwordRoutes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Password Breach Checker running at http://localhost:${PORT}`));
}).catch((err) => {
  console.error("MongoDB connection failed:", err.message);
  process.exit(1);
});
