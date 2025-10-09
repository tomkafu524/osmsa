const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const authRoutes = require('./routes/auth');
const User = require('./models/user');
const { apiLimiter, setSecurityHeaders } = require('./middleware/security');

// Initialize express app
const app = express();

// Security middleware
app.use(setSecurityHeaders);

// Rate limiting
app.use('/api/', apiLimiter);

// Logging middleware
app.use(morgan('combined'));

// CORS middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create database tables on startup
User.createTable();

// API routes
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Premium Authentication System API',
    version: '1.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred'
  });
});

// Start server
const server = app.listen(config.port, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${config.port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
