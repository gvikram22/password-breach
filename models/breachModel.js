const mongoose = require("mongoose");

// Stores aggregate check counts only. Never stores passwords or password hashes.
const breachCheckSchema = new mongoose.Schema({
  exposed: { type: Boolean, required: true },
  count: { type: Number, required: true, min: 0 },
  checkedAt: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model("BreachCheck", breachCheckSchema);
