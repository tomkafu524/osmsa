const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');
const auth = require('../middleware/auth');

// @route   GET api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 8 characters and include a number and special character')
      .isLength({ min: 8 })
      .matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
    check('full_name', 'Full name is required').notEmpty().trim()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password, full_name } = req.body;

    try {
      // Check if user exists
      let user = await User.findByEmail(email);
      if (user) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      // Create new user
      user = await User.create({
        email,
        password,
        full_name
      });

      // In a production system, you would send a verification email here
      // with the verification_token

      // Create JWT payload
      const payload = {
        user: {
          id: user.id,
          email: user.email
        }
      };

      // Sign token
      jwt.sign(
        payload,
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn },
        (err, token) => {
          if (err) throw err;
          res.status(201).json({
            success: true,
            message: 'User registered successfully. Please verify your email.',
            token,
            user: {
              id: user.id,
              email: user.email,
              full_name: user.full_name,
              is_verified: user.is_verified
            }
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        success: false,
        message: 'Server error during registration'
      });
    }
  }
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if account is locked
      if (user.account_locked) {
        return res.status(401).json({
          success: false,
          message: 'Account is locked due to too many failed login attempts'
        });
      }

      // Check password
      const isMatch = await User.verifyPassword(user, password);
      if (!isMatch) {
        // Increment failed login attempts
        await User.incrementFailedLoginAttempts(email);
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Reset failed login attempts
      await User.resetFailedLoginAttempts(email);
      
      // Update last login timestamp
      await User.updateLastLogin(email);

      // Create JWT payload
      const payload = {
        user: {
          id: user.id,
          email: user.email
        }
      };

      // Sign token
      jwt.sign(
        payload,
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn },
        (err, token) => {
          if (err) throw err;
          res.json({
            success: true,
            token,
            user: {
              id: user.id,
              email: user.email,
              full_name: user.full_name,
              is_verified: user.is_verified
            }
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        success: false,
        message: 'Server error during login'
      });
    }
  }
);

module.exports = router;
