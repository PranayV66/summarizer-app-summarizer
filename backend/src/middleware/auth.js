const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: '../../../.env' });

const authMiddleware = (req, res, next) => {
  console.log("Auth middleware request: ", req);
  console.log("Auth middleware cookies: ", req.cookies);
  const token = req.cookies.token; // Extract token from cookies
  console.log('Received token: ', token);
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { user_id: decoded.user_id, username: decoded.username };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;