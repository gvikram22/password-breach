const crypto = require("crypto");
const BreachCheck = require("../models/breachModel");

// HIBP k-anonymity: only the first 5 SHA-1 hex characters leave this server.
async function checkPassword(req, res, next) {
  try {
    const { password } = req.body || {};
    if (typeof password !== "string" || password.length < 1 || password.length > 256) {
      return res.status(400).json({ message: "Provide a password between 1 and 256 characters." });
    }

    const sha1 = crypto.createHash("sha1").update(password, "utf8").digest("hex").toUpperCase();
    // Drop the raw password reference as soon as possible; it is never logged or persisted.
    req.body.password = undefined;
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { "Add-Padding": "true", "User-Agent": "Password-Breach-Checker-Demo/1.0" }
    });
    if (!response.ok) throw new Error(`HIBP API returned ${response.status}`);
    const body = await response.text();
    const match = body.split(/\r?\n/).find(line => line.split(":")[0].trim().toUpperCase() === suffix);
    const count = match ? Number(match.split(":")[1]) : 0;
    const exposed = count > 0;

    // Optional anonymous aggregate record; no password or hash is stored.
    await BreachCheck.create({ exposed, count });
    return res.json({
      exposed,
      count,
      message: exposed ? "This password has appeared in known data breaches." : "No match found in the Pwned Passwords dataset.",
      recommendation: exposed
        ? "Change this password anywhere you use it. Use a unique password and enable MFA."
        : "This result does not guarantee safety. Use a unique, strong password and enable MFA."
    });
  } catch (err) {
    next(err);
  }
}

async function health(req, res) {
  res.json({ status: "ok", service: "password-breach-checker" });
}
module.exports = { checkPassword, health };
