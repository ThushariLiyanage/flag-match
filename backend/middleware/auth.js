const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from cookies or Authorization header (fallback)
  const cookieToken = req.cookies?.token;
  const authHeader = req.header('Authorization');
  const token = cookieToken || (authHeader ? authHeader.split(' ')[1] : null);

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};