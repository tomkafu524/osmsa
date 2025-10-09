const mysql = require('mysql2/promise');
const config = require('../config');
const bcrypt = require('bcryptjs');

class User {
  static async connect() {
    return await mysql.createConnection(config.mysql);
  }

  static async createTable() {
    const connection = await this.connect();
    try {
      const sql = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          full_name VARCHAR(255) NOT NULL,
          is_verified BOOLEAN DEFAULT FALSE,
          verification_token VARCHAR(255),
          reset_password_token VARCHAR(255),
          reset_password_expires DATETIME,
          failed_login_attempts INT DEFAULT 0,
          account_locked BOOLEAN DEFAULT FALSE,
          last_login DATETIME,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_email (email)
        )
      `;
      await connection.execute(sql);
      console.log('Users table created or already exists');
    } catch (error) {
      console.error('Error creating users table:', error);
    } finally {
      await connection.end();
    }
  }

  static async findByEmail(email) {
    const connection = await this.connect();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0];
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  static async findById(id) {
    const connection = await this.connect();
    try {
      const [rows] = await connection.execute(
        'SELECT id, email, full_name, is_verified, created_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  static async create(userData) {
    const connection = await this.connect();
    try {
      // Hash password with high work factor
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Generate verification token
      const verificationToken = require('crypto').randomBytes(32).toString('hex');

      const [result] = await connection.execute(
        `INSERT INTO users 
         (email, password, full_name, verification_token) 
         VALUES (?, ?, ?, ?)`,
        [userData.email, hashedPassword, userData.full_name, verificationToken]
      );

      return { 
        id: result.insertId, 
        email: userData.email,
        full_name: userData.full_name,
        is_verified: false,
        verification_token: verificationToken
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  static async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }

  static async incrementFailedLoginAttempts(email) {
    const connection = await this.connect();
    try {
      // Increment failed attempts and lock account after 5 attempts
      await connection.execute(
        `UPDATE users 
         SET failed_login_attempts = failed_login_attempts + 1,
             account_locked = IF(failed_login_attempts + 1 >= 5, TRUE, account_locked)
         WHERE email = ?`,
        [email]
      );
    } catch (error) {
      console.error('Error incrementing failed login attempts:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  static async resetFailedLoginAttempts(email) {
    const connection = await this.connect();
    try {
      await connection.execute(
        `UPDATE users 
         SET failed_login_attempts = 0,
             account_locked = FALSE
         WHERE email = ?`,
        [email]
      );
    } catch (error) {
      console.error('Error resetting failed login attempts:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  static async updateLastLogin(email) {
    const connection = await this.connect();
    try {
      await connection.execute(
        'UPDATE users SET last_login = NOW() WHERE email = ?',
        [email]
      );
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }
}

module.exports = User;
