# 高价值登录系统 - 一键部署版

这个登录系统已经预先配置好你的MySQL数据库信息，可直接部署到Zeabur。

## 部署步骤（超简单）

### 1. 创建项目文件夹
在本地创建一个新文件夹，例如 `zeabur-login`

### 2. 创建文件
在文件夹中创建以下文件，复制对应代码：
- `server.js`
- `package.json`
- 创建 `public` 文件夹，在其中创建 `login.html`、`register.html`、`dashboard.html`

### 3. 部署到Zeabur

#### 方法A：通过GitHub（推荐）
1. 将文件夹上传到你的GitHub仓库
2. 登录Zeabur控制台 (https://console.zeabur.com)
3. 新建项目，选择"从GitHub导入"
4. 选择你的仓库，等待部署完成

#### 方法B：通过本地部署
1. 安装Zeabur CLI：`npm install -g @zeabur/cli`
2. 进入项目文件夹：`cd zeabur-login`
3. 登录：`zeabur login`
4. 部署：`zeabur deploy`

### 4. 访问系统
部署完成后，在Zeabur控制台找到分配的域名（xxx.zeabur.app），点击即可访问

## 功能说明
- 用户注册：创建新账号
- 用户登录：验证身份
- 会话管理：保持登录状态
- 安全特性：密码加密存储

## 注意事项
- 系统会自动创建必要的数据库表
- 首次访问可能需要几秒钟初始化数据库
- 所有密码使用bcrypt加密存储，确保安全
