// server/middleware/auth.js
const { verify } = require("jsonwebtoken");

function authenticate(req, res, next) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing bearer token" });
  }

  const token = auth.slice(7);

  try {
    const user = verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    req.user = user;        // { guestId, name, isGuest }
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

module.exports = authenticate;   // <‑‑ CommonJS export
