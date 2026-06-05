// middleware/requireAuth.js
const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: "Access denied. No VIP pass." });
  }

  try {
    const actualToken = token.replace('Bearer ', '');
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET || 'super_secret_melancholy_key');
    
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
};

module.exports = requireAuth;