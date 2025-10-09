require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mysql: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-ultra-secure-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },
  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  }
};
