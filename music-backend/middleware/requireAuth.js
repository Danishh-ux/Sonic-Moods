// middleware/requireAuth.js
const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  // 1. Look for the token in the headers
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: "Access denied. No VIP pass." });
  }

  try {
    // 2. Remove the word "Bearer " if it's there, and verify the token
    const actualToken = token.replace('Bearer ', '');
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET || 'super_secret_melancholy_key');
    
    // 3. Attach the decoded user ID to the request so our routes can use it
    req.user = decoded; 
    next(); // Let them through to the route!
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
};

module.exports = requireAuth;