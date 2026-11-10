module.exports = (err, req, res, next) => {
  console.error("Request error:", err.message);
  res.status(500).json({ message: "Unable to check right now. Please try again later." });
};
