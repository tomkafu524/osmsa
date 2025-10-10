const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session配置
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1天有效期
  }
}));

// 数据库连接配置
const dbConfig = {
  host: process.env.DB_HOST || 'sjc1.clusters.zeabur.com',
  port: process.env.DB_PORT || 32183,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '29SlO58KCBLjzM4b10qpyP7mD3No6iWZ',
  database: process.env.DB_NAME || 'zeabur',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// 创建数据库连接池
const pool = mysql.createPool(dbConfig);

// 检查数据库连接并创建用户表（如果不存在）
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // 创建用户表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// 初始化数据库
initializeDatabase();

// 路由
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

app.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

app.get('/register', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
  }
});

app.get('/dashboard', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
  } else {
    res.redirect('/login');
  }
});

app.get('/api/user', (req, res) => {
  if (req.session.user) {
    res.json({ 
      loggedIn: true, 
      user: {
        id: req.session.user.id,
        username: req.session.user.username,
        email: req.session.user.email
      }
    });
  } else {
    res.json({ loggedIn: false });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.json({ success: false, message: '请填写所有字段' });
  }
  
  try {
    const connection = await pool.getConnection();
    
    // 检查用户名是否已存在
    const [usernameCheck] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    if (usernameCheck.length > 0) {
      connection.release();
      return res.json({ success: false, message: '用户名已存在' });
    }
    
    // 检查邮箱是否已存在
    const [emailCheck] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (emailCheck.length > 0) {
      connection.release();
      return res.json({ success: false, message: '邮箱已被注册' });
    }
    
    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 插入新用户
    await connection.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    connection.release();
    res.json({ success: true, message: '注册成功，请登录' });
  } catch (error) {
    console.error('注册错误:', error);
    res.json({ success: false, message: '注册失败，请稍后再试' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.json({ success: false, message: '请填写所有字段' });
  }
  
  try {
    const connection = await pool.getConnection();
    
    // 查询用户
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    connection.release();
    
    if (users.length === 0) {
      return res.json({ success: false, message: '用户名或密码错误' });
    }
    
    const user = users[0];
    
    // 验证密码
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.json({ success: false, message: '用户名或密码错误' });
    }
    
    // 设置session
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    
    res.json({ 
      success: true, 
      message: '登录成功',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.json({ success: false, message: '登录失败，请稍后再试' });
  }
});

app.get('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.json({ success: false, message: '退出登录失败' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true, message: '退出登录成功' });
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
