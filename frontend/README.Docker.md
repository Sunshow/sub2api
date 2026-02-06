# Sub2API 前端独立 Docker 部署

## 快速开始

### 构建镜像

```bash
cd frontend
docker build -t sub2api-frontend:latest .
```

### 运行容器

```bash
# 使用反向代理模式（推荐）
docker run -d \
  --name sub2api-frontend \
  -p 3000:80 \
  -e BACKEND_URL=https://api.example.com \
  sub2api-frontend:latest

# 查看日志
docker logs -f sub2api-frontend

# 停止容器
docker stop sub2api-frontend

# 删除容器
docker rm sub2api-frontend
```

### 访问应用

- 前端地址：http://localhost:3000
- 健康检查：http://localhost:3000/health

## 环境变量

| 变量名 | 说明 | 默认值 | 示例 |
|--------|------|--------|------|
| `BACKEND_URL` | 后端 API 地址 | `http://localhost:8080` | `https://api.example.com` |

## 镜像信息

- 基础镜像：`nginx:alpine`
- 镜像大小：约 69MB
- 暴露端口：80

## 技术栈

- **构建阶段**：Node.js 24 + pnpm + Vite
- **运行阶段**：Nginx Alpine
- **反向代理**：Nginx 代理 `/api` 和 `/setup` 到后端

## 文件说明

- `Dockerfile` - 多阶段构建配置
- `nginx.conf` - Nginx 配置模板
- `docker-entrypoint.sh` - 启动脚本（环境变量注入）
- `.dockerignore` - 构建优化

## 生产部署建议

1. **使用 HTTPS**：配置 SSL 证书或使用反向代理（如 Caddy、Traefik）
2. **资源限制**：使用 `--memory` 和 `--cpus` 限制容器资源
3. **日志管理**：配置日志驱动（如 `json-file` 或 `syslog`）
4. **健康检查**：容器内置健康检查，可通过 `/health` 端点监控

## 故障排查

### 查看容器状态
```bash
docker ps -a | grep sub2api-frontend
```

### 查看日志
```bash
docker logs sub2api-frontend
```

### 进入容器调试
```bash
docker exec -it sub2api-frontend sh
```

### 测试 Nginx 配置
```bash
docker exec sub2api-frontend nginx -t
```

## 与后端集成

前端通过 Nginx 反向代理将 `/api` 和 `/setup` 请求转发到后端：

```nginx
location /api {
    proxy_pass ${BACKEND_URL};
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 构建优化

- 使用多阶段构建减小镜像体积
- 利用 Docker 缓存加速构建
- 排除不必要的文件（通过 `.dockerignore`）
- Gzip 压缩静态资源

## 更新部署

```bash
# 1. 重新构建镜像
docker build -t sub2api-frontend:latest .

# 2. 停止并删除旧容器
docker stop sub2api-frontend
docker rm sub2api-frontend

# 3. 启动新容器
docker run -d \
  --name sub2api-frontend \
  -p 3000:80 \
  -e BACKEND_URL=https://api.example.com \
  sub2api-frontend:latest
```
