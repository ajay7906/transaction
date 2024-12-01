// const jwt = require("jsonwebtoken");

// const authenticate = (req, res, next) => {
//   //const token = req.headers.authorization?.split(" ")[1];
//   const token = req.headers.authorization;
//   console.log(token);
  
//   if (!token) return res.status(401).json({ error: "Access denied" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(403).json({ error: "Invalid token" });
//   }
// };

// module.exports = { authenticate };






























const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
   console.log(authHeader);
   
  // Check if the authorization header is present
  if (!authHeader) {
    return res.status(401).json({ error: "Access denied" });
  }

  // Extract the token by removing "Bearer " from the authorization header
  const token = authHeader.split(" ")[1];
    log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store decoded token payload in req.user
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = { authenticate };
