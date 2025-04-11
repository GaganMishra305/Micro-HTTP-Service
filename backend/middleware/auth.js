const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Log incoming headers for debugging
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('No valid auth header found');
    return res.status(401).json({ message: 'Authentication token required' });
  }

  const token = authHeader.split(' ')[1];
  // Verify token with proper error handling
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Token verification failed:', err.message);
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ message: 'Token expired' });
      }
      return res.status(403).json({ message: 'Invalid token' });
    }

    console.log('Token decoded successfully:', decoded);
    req.user = decoded;
    next();
  });
};

module.exports = authenticateToken;