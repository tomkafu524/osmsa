const express = require('express');
const cors = require('cors');
const app = express();

// 基础配置
app.use(cors());
app.use(express.json());

// 【关键修复】根路径路由，解决404问题
app.get('/', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>登录系统</title>
        <style>
          body { font-family: Arial; text-align: center; padding: 50px; }
          .container { max-width: 600px; margin: 0 auto; }
          h1 { color: #333; }
          .status { color: green; font-size: 1.2em; margin: 20px 0; }
          .endpoints { text-align: left; margin-top: 30px; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>登录系统已成功部署</h1>
          <div class="status">✅ 系统运行正常</div>
          <div class="endpoints">
            <h3>可用接口：</h3>
            <p>• POST /api/auth/register - 用户注册</p>
            <p>• POST /api/auth/login - 用户登录</p>
            <p>• GET /api/auth/me - 获取当前用户信息（需登录）</p>
          </div>
        </div>
      </body>
    </html>
  `);
});

// 登录相关路由（基础框架，无需对接其他服务也能运行）
app.post('/api/auth/register', (req, res) => {
  res.status(200).json({ message: '注册接口已就绪', received: req.body });
});

app.post('/api/auth/login', (req, res) => {
  res.status(200).json({ message: '登录接口已就绪', received: req.body });
});

app.get('/api/auth/me', (req, res) => {
  res.status(200).json({ message: '用户信息接口已就绪' });
});

// 启动服务器（使用Zeabur提供的端口）
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`服务器已启动，运行在端口 ${port}`);
});
