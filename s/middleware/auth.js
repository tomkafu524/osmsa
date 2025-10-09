const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided, authorization denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Check if user still exists
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User no longer exists, authorization denied' 
      });
    }
    
    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired, please login again' 
      });
    }
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};

module.exports = auth;
