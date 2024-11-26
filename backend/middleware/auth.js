const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  //const token = req.headers.authorization?.split(" ")[1];
  const token = req.headers.authorization;
  console.log(token);
  
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = { authenticate };
