const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');

const app = express();

// 配置
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // 必须绑定到0.0.0.0才能在Zeabur上访问

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'your-secret-key-123', // 用于加密会话
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// 数据库连接
const pool = mysql.createPool({
  host: 'sjc1.clusters.zeabur.com',
  port: 32183,
  user: 'root',
  password: '29SlO58KCBLjzM4b10qpyP7mD3No6iWZ',
  database: 'zeabur',
  waitForConnections: true,
  connectionLimit: 10
});

// 检查并创建用户表
async function initDB() {
  try {
    const connection = await pool.getConnection();
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    connection.release();
    console.log('数据库初始化完成');
  } catch (err) {
    console.error('数据库初始化错误:', err);
    // 5秒后重试
    setTimeout(initDB, 5000);
  }
}

// 路由
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// 注册
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    connection.release();
    
    res.redirect('/login.html?registered=1');
  } catch (err) {
    console.error('注册错误:', err);
    res.redirect('/register.html?error=1');
  }
});

// 登录
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    connection.release();
    
    if (rows.length === 0) {
      return res.redirect('/login.html?error=1');
    }
    
    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (passwordMatch) {
      req.session.userId = user.id;
      req.session.username = user.username;
      res.redirect('/dashboard.html');
    } else {
      res.redirect('/login.html?error=1');
    }
  } catch (err) {
    console.error('登录错误:', err);
    res.redirect('/login.html?error=1');
  }
});

// 检查登录状态
app.get('/check-login', (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true, username: req.session.username });
  } else {
    res.json({ loggedIn: false });
  }
});

// 登出
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login.html');
});

// 启动服务器
app.listen(PORT, HOST, () => {
  console.log(`服务器运行在 http://${HOST}:${PORT}`);
  initDB(); // 初始化数据库
});

// 错误处理
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('未处理的Promise拒绝:', reason);
});
    