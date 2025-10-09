const rateLimit = require('rate-limit');
const helmet = require('helmet');
const config = require('../config');

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: config.security.rateLimit.windowMs,
  max: config.security.rateLimit.max,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers middleware
const setSecurityHeaders = helmet();

module.exports = {
  apiLimiter,
  setSecurityHeaders
};
