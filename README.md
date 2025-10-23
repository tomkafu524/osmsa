# Zeabur 部署配置说明

## 📦 已配置文件

### 1. `.php-version`
指定 PHP 运行时版本为 **8.1**

### 2. `composer.json`
- PHP 版本要求: ^7.4|^8.0|^8.1
- 必需扩展: PDO, JSON, mbstring
- 平台配置: PHP 8.1

### 3. `.zbpack.json` (Zeabur 专用)
- **php_version**: 8.1
- **build_command**: composer install --no-dev --optimize-autoloader
- **start_command**: php -S 0.0.0.0:$PORT -t public

## 🚀 部署步骤

1. 将这些配置文件复制到项目根目录
2. 确保项目根目录有 `composer.json` 和 `composer.lock`
3. 在 Zeabur 上连接您的 Git 仓库
4. Zeabur 会自动检测配置并使用 PHP 8.1 部署

## ⚙️ 自定义配置

如需修改 PHP 版本，同时修改以下文件：
- `.php-version`: 改为目标版本号（如 8.2）
- `composer.json`: 更新 require.php 和 config.platform.php
- `.zbpack.json`: 更新 php_version

## 📌 注意事项

- 建议使用 PHP 8.1 以获得最佳性能和兼容性
- 如果项目使用了 public 目录作为入口，start_command 已配置 `-t public`
- 如果入口目录不同，请修改 `.zbpack.json` 中的 start_command
