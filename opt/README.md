# 高价值登录系统

这是一个部署在Zeabur上的高性能登录系统，使用MySQL数据库存储用户信息，具备完善的用户注册、登录功能和安全措施。

## 功能特点

- 安全的用户认证系统
- 密码加密存储（bcrypt算法）
- 会话管理
- 响应式设计，适配各种设备
- 美观的用户界面
- 完善的错误处理

## 部署步骤

### 1. 准备工作

确保您已拥有：
- Zeabur账号
- Git工具

### 2. 克隆代码
git clone <仓库地址>
cd zeabur-login-system
### 3. 配置环境变量

复制环境变量示例文件并修改：
cp .env.example .env
默认已填入您提供的数据库信息，建议修改`SESSION_SECRET`为随机字符串。

### 4. 部署到Zeabur

#### 方法一：通过Zeabur控制台部署

1. 登录Zeabur控制台
2. 点击"新建项目"
3. 选择"从GitHub导入"
4. 选择您的仓库
5. 等待部署完成

#### 方法二：使用Zeabur CLI部署
# 安装Zeabur CLI（如果尚未安装）
npm install -g @zeabur/cli

# 登录
zeabur login

# 部署
zeabur deploy
### 5. 配置域名

1. 在Zeabur项目页面，找到"域名"选项
2. 可以使用Zeabur提供的免费域名，或绑定您自己的域名
3. 等待DNS配置生效（通常几分钟到几小时）

## 技术栈

- 前端：HTML, CSS, JavaScript, Tailwind CSS, Font Awesome
- 后端：Node.js, Express
- 数据库：MySQL
- 部署平台：Zeabur

## 安全措施

- 密码加密存储（bcrypt）
- 防SQL注入（参数化查询）
- 会话管理
- HTTPS支持（Zeabur自动配置）