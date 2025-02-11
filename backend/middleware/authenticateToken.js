// middleware/authenticateToken.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
// Define the JWT secret directly in the code
const secretKey = process.env.JWT_SECRET;  // Hardcoded secret (for testing purposes)
// Middleware to authenticate the JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from 'Authorization' header (Bearer <token>)

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using JWT secret
    const decoded = jwt.verify(token, secretKey) ; //ure the secret is same as the one used while generating the token
    req.user = decoded; // Attach the decoded token (user info) to the request object
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error(error);
    res.status(403).json({ error: 'Invalid or expired token.' }); // Token verification failed
  }
};

module.exports = authenticateToken;

