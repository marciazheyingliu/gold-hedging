# 部署指南

本项目支持多种部署方式，包括 Vercel、Docker、Netlify 等。

## 前置要求

- Node.js 20+ （用于本地开发和构建）
- npm 或 pnpm

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

## 部署到 Vercel (推荐)

Vercel 提供最简单的部署方式，支持自动 CI/CD。

### 步骤：

1. 确保你的代码已推送到 GitHub/GitLab/Bitbucket
2. 访问 [vercel.com](https://vercel.com) 并注册/登录
3. 点击 "New Project"，选择你的仓库
4. 保持默认配置，点击 "Deploy"
5. 完成！你的网站将在几分钟内上线

### 优势：
- 免费额度适合个人项目
- 自动 HTTPS 和 CDN
- 每次推送到 main 分支自动部署

## 使用 Docker 部署

### 构建和运行：

```bash
# 构建镜像
docker build -t gold-hedge-app .

# 运行容器
docker run -p 3000:3000 --name gold-hedge-container gold-hedge-app

# 访问 http://localhost:3000
```

### 使用 Docker Compose (可选):

创建 `docker-compose.yml`:

```yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    restart: unless-stopped
```

然后运行：
```bash
docker-compose up -d
```

## 部署到 Netlify

与 Vercel 类似，Netlify 提供简单的 Git 集成部署：

1. 访问 [netlify.com](https://netlify.com)
2. 导入你的仓库
3. 配置构建命令：`npm run build`
4. 发布目录：`dist`
5. 部署！

## 部署到传统服务器 (Nginx)

1. 构建项目：
```bash
npm run build
```

2. 将 `dist` 目录的内容上传到服务器

3. 配置 Nginx (`/etc/nginx/sites-available/your-app`):

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/gold-hedge-app;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

4. 启用站点：
```bash
sudo ln -s /etc/nginx/sites-available/your-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 环境变量

对于生产部署，你可能需要配置一些环境变量（如果需要接入真实的市场数据源）：

创建 `.env` 文件：

```env
# 示例环境变量（如果将来接入真实 API）
# MARKET_DATA_API_KEY=your_key_here
```

## 注意事项

1. **API 密钥安全**：用户的 API 密钥存储在浏览器的 localStorage 中，不会发送到你的服务器
2. **市场数据**：当前市场数据是模拟数据，你可以替换为真实的 API 源
3. **HTTPS**：生产部署务必使用 HTTPS

## 故障排除

### 问题：构建失败
解决：确保 Node.js 版本 ≥ 20，删除 node_modules 并重新安装

### 问题：部署后路由无法访问
解决：确保服务器配置了 SPA 路由回退到 index.html

### 问题：API 请求失败
解决：检查是否有 CORS 问题，可能需要配置代理或使用 CORS 代理服务

## 下一步

- 考虑接入真实的市场数据 API (如 Yahoo Finance, Alpha Vantage 等)
- 添加用户账户系统
- 添加策略历史记录和对比功能
