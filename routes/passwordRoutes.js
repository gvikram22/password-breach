const router = require("express").Router();
const { checkPassword, health } = require("../controllers/passwordController");
router.post("/check", checkPassword);
router.get("/health", health);
module.exports = router;