# 使用官方 Node.js 基础镜像
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制所有源文件
COPY . .

# 构建项目
RUN npm run build

# 生产阶段
FROM node:20-alpine AS production

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 只安装生产依赖
RUN npm ci --only=production

# 从 builder 阶段复制构建产物
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/index.html ./index.html

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "run", "preview"]
