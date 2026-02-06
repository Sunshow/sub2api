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
| `CUSTOM_MENU_ITEMS` | 自定义菜单项配置（JSON 数组） | `[]` | 见下方示例 |

### 自定义菜单配置

通过 `CUSTOM_MENU_ITEMS` 环境变量可以动态添加自定义菜单项，无需重新构建镜像。

#### 配置格式

```bash
CUSTOM_MENU_ITEMS='[
  {
    "label": "文档中心",
    "labelEn": "Documentation",
    "url": "https://docs.example.com",
    "icon": "book",
    "target": "_blank",
    "position": "both"
  },
  {
    "label": "帮助中心",
    "labelEn": "Help Center",
    "url": "https://help.example.com",
    "icon": "question",
    "target": "_blank",
    "position": "user"
  }
]'
```

#### 字段说明

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `label` | string | 是 | 中文菜单名称 | `"文档中心"` |
| `labelEn` | string | 是 | 英文菜单名称 | `"Documentation"` |
| `url` | string | 是 | 跳转链接（支持内部路由或外部 URL） | `"https://docs.example.com"` |
| `icon` | string | 否 | 图标名称（见下方支持列表） | `"book"` |
| `target` | string | 否 | 打开方式：`_self` 或 `_blank` | `"_blank"` |
| `position` | string | 否 | 显示位置：`user`、`admin` 或 `both` | `"both"` |

#### 支持的图标

- `book` - 书籍图标（适合文档）
- `question` - 问号图标（适合帮助）
- `link` - 链接图标（通用链接）
- `external` - 外部链接图标
- `home` - 首页图标
- `chart` - 图表图标
- `settings` - 设置图标
- `user` - 用户图标
- `gift` - 礼物图标

#### 使用示例

**Docker Run:**
```bash
docker run -d \
  --name sub2api-frontend \
  -p 3000:80 \
  -e BACKEND_URL=https://api.example.com \
  -e CUSTOM_MENU_ITEMS='[{"label":"文档","labelEn":"Docs","url":"https://docs.example.com","icon":"book","target":"_blank","position":"both"}]' \
  sub2api-frontend:latest
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  frontend:
    image: sub2api-frontend:latest
    ports:
      - "3000:80"
    environment:
      - BACKEND_URL=https://api.example.com
      - CUSTOM_MENU_ITEMS=[{"label":"文档中心","labelEn":"Documentation","url":"https://docs.example.com","icon":"book","target":"_blank","position":"both"},{"label":"帮助中心","labelEn":"Help Center","url":"https://help.example.com","icon":"question","target":"_blank","position":"user"}]
```

**多个菜单项示例:**
```bash
CUSTOM_MENU_ITEMS='[
  {
    "label": "API 文档",
    "labelEn": "API Docs",
    "url": "https://docs.example.com/api",
    "icon": "book",
    "target": "_blank",
    "position": "both"
  },
  {
    "label": "用户指南",
    "labelEn": "User Guide",
    "url": "https://docs.example.com/guide",
    "icon": "question",
    "target": "_blank",
    "position": "user"
  },
  {
    "label": "管理员手册",
    "labelEn": "Admin Manual",
    "url": "https://docs.example.com/admin",
    "icon": "settings",
    "target": "_blank",
    "position": "admin"
  },
  {
    "label": "社区论坛",
    "labelEn": "Community",
    "url": "https://community.example.com",
    "icon": "home",
    "target": "_blank",
    "position": "both"
  }
]'
```

#### 注意事项

1. **JSON 格式**：确保 JSON 格式正确，特别是引号和逗号
2. **URL 编码**：在某些环境中可能需要对特殊字符进行转义
3. **显示位置**：
   - `user` - 仅在普通用户侧边栏显示
   - `admin` - 仅在管理员侧边栏的"个人账户"区域显示
   - `both` - 在两个位置都显示
4. **默认值**：
   - `icon` 默认为 `link`
   - `target` 默认为 `_self`
   - `position` 默认为 `both`

## Docker Compose 部署

以下提供多种 Docker Compose 配置方案，根据不同场景选择合适的方式。

### 方案一：简单配置（1-2 个菜单项）

适合快速测试，直接在 compose 文件中配置。

```yaml
version: '3.8'
services:
  frontend:
    image: sub2api-frontend:latest
    ports:
      - "3000:80"
    environment:
      - BACKEND_URL=http://sub2api:8080
      - CUSTOM_MENU_ITEMS=[{"label":"文档","labelEn":"Docs","url":"https://docs.example.com","icon":"book","target":"_blank","position":"both"}]
```

### 方案二：.env 文件配置（推荐）⭐

最常用的方案，配置与代码分离，便于管理。

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  frontend:
    image: sub2api-frontend:latest
    ports:
      - "3000:80"
    environment:
      - BACKEND_URL=${BACKEND_URL:-http://sub2api:8080}
      - CUSTOM_MENU_ITEMS=${CUSTOM_MENU_ITEMS:-[]}
```

**.env 文件（单行格式）:**
```bash
BACKEND_URL=http://sub2api:8080
CUSTOM_MENU_ITEMS=[{"label":"API 文档","labelEn":"API Docs","url":"https://docs.example.com/api","icon":"book","target":"_blank","position":"both"},{"label":"用户指南","labelEn":"User Guide","url":"https://docs.example.com/guide","icon":"question","target":"_blank","position":"user"}]
```

**.env 文件（多行格式，更易读）:**
```bash
BACKEND_URL=http://sub2api:8080
CUSTOM_MENU_ITEMS=[\
{"label":"API 文档","labelEn":"API Docs","url":"https://docs.example.com/api","icon":"book","target":"_blank","position":"both"},\
{"label":"用户指南","labelEn":"User Guide","url":"https://docs.example.com/guide","icon":"question","target":"_blank","position":"user"},\
{"label":"管理员手册","labelEn":"Admin Manual","url":"https://docs.example.com/admin","icon":"settings","target":"_blank","position":"admin"},\
{"label":"社区论坛","labelEn":"Community","url":"https://community.example.com","icon":"home","target":"_blank","position":"both"}\
]
```

### 方案三：多行 YAML 配置（可读性最佳）

适合配置固定的场景，YAML 多行字符串语法提供最佳可读性。

```yaml
version: '3.8'
services:
  frontend:
    image: sub2api-frontend:latest
    ports:
      - "3000:80"
    environment:
      BACKEND_URL: http://sub2api:8080
      CUSTOM_MENU_ITEMS: |
        [
          {
            "label": "API 文档",
            "labelEn": "API Docs",
            "url": "https://docs.example.com/api",
            "icon": "book",
            "target": "_blank",
            "position": "both"
          },
          {
            "label": "用户指南",
            "labelEn": "User Guide",
            "url": "https://docs.example.com/guide",
            "icon": "question",
            "target": "_blank",
            "position": "user"
          },
          {
            "label": "管理员手册",
            "labelEn": "Admin Manual",
            "url": "https://docs.example.com/admin",
            "icon": "settings",
            "target": "_blank",
            "position": "admin"
          }
        ]
```

### 方案四：外部 JSON 文件（复杂配置）

适合复杂配置，便于维护和版本控制，支持注释。

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  frontend:
    image: sub2api-frontend:latest
    ports:
      - "3000:80"
    volumes:
      - ./menu-config.json:/tmp/menu-config.json:ro
      - ./entrypoint-wrapper.sh:/entrypoint-wrapper.sh:ro
    entrypoint: ["/entrypoint-wrapper.sh"]
    environment:
      - BACKEND_URL=http://sub2api:8080
```

**menu-config.json:**
```json
[
  {
    "label": "API 文档",
    "labelEn": "API Docs",
    "url": "https://docs.example.com/api",
    "icon": "book",
    "target": "_blank",
    "position": "both"
  },
  {
    "label": "用户指南",
    "labelEn": "User Guide",
    "url": "https://docs.example.com/guide",
    "icon": "question",
    "target": "_blank",
    "position": "user"
  },
  {
    "label": "管理员手册",
    "labelEn": "Admin Manual",
    "url": "https://docs.example.com/admin",
    "icon": "settings",
    "target": "_blank",
    "position": "admin"
  }
]
```

**entrypoint-wrapper.sh:**
```bash
#!/bin/sh
# 读取 JSON 文件并设置为环境变量
export CUSTOM_MENU_ITEMS=$(cat /tmp/menu-config.json | tr -d '\n' | tr -d ' ')
# 调用原始入口脚本
exec /docker-entrypoint.sh
```

使用前需要给脚本添加执行权限：
```bash
chmod +x entrypoint-wrapper.sh
```

### 方案五：Override 文件（团队协作）

适合团队开发，每个人可以有自己的配置，避免配置冲突。

**docker-compose.yml（基础配置，提交到 git）:**
```yaml
version: '3.8'
services:
  frontend:
    image: sub2api-frontend:latest
    ports:
      - "3000:80"
    environment:
      - BACKEND_URL=${BACKEND_URL:-http://sub2api:8080}
```

**docker-compose.override.yml（个人配置，不提交到 git）:**
```yaml
version: '3.8'
services:
  frontend:
    environment:
      - CUSTOM_MENU_ITEMS=[{"label":"本地文档","labelEn":"Local Docs","url":"http://localhost:8000","icon":"book","target":"_blank","position":"both"}]
```

**.gitignore:**
```
docker-compose.override.yml
```

Docker Compose 会自动合并 `docker-compose.yml` 和 `docker-compose.override.yml`。

### 完整示例：与后端集成

一个包含前后端的完整 Docker Compose 配置示例：

```yaml
version: '3.8'

services:
  # 后端服务
  backend:
    image: weishaw/sub2api:latest
    container_name: sub2api-backend
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      - AUTO_SETUP=true
      - DATABASE_HOST=postgres
      - DATABASE_PORT=5432
      - DATABASE_USER=sub2api
      - DATABASE_PASSWORD=your_secure_password
      - DATABASE_DBNAME=sub2api
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - TZ=Asia/Shanghai
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - sub2api-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # 前端服务
  frontend:
    image: sub2api-frontend:latest
    container_name: sub2api-frontend
    restart: unless-stopped
    ports:
      - "3000:80"
    environment:
      - BACKEND_URL=http://backend:8080
      - CUSTOM_MENU_ITEMS=${CUSTOM_MENU_ITEMS:-[]}
    depends_on:
      - backend
    networks:
      - sub2api-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # PostgreSQL 数据库
  postgres:
    image: postgres:18-alpine
    container_name: sub2api-postgres
    restart: unless-stopped
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=sub2api
      - POSTGRES_PASSWORD=your_secure_password
      - POSTGRES_DB=sub2api
      - TZ=Asia/Shanghai
    networks:
      - sub2api-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U sub2api -d sub2api"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis 缓存
  redis:
    image: redis:8-alpine
    container_name: sub2api-redis
    restart: unless-stopped
    volumes:
      - redis_data:/data
    command: redis-server --save 60 1 --appendonly yes
    environment:
      - TZ=Asia/Shanghai
    networks:
      - sub2api-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

networks:
  sub2api-network:
    driver: bridge
```

**配套的 .env 文件：**
```bash
# 自定义菜单配置
CUSTOM_MENU_ITEMS=[\
{"label":"API 文档","labelEn":"API Docs","url":"https://docs.example.com/api","icon":"book","target":"_blank","position":"both"},\
{"label":"用户指南","labelEn":"User Guide","url":"https://docs.example.com/guide","icon":"question","target":"_blank","position":"user"},\
{"label":"社区论坛","labelEn":"Community","url":"https://community.example.com","icon":"home","target":"_blank","position":"both"}\
]
```

**启动命令：**
```bash
docker-compose up -d
```

**访问地址：**
- 前端：http://localhost:3000
- 后端 API：http://localhost:8080

### Docker Compose 最佳实践

#### 配置选择建议

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| 快速测试 | 方案一 | 配置简单，一行搞定 |
| 生产环境 | 方案二 | 配置分离，便于管理 |
| 固定配置 | 方案三 | 可读性好，易于维护 |
| 复杂配置 | 方案四 | 结构清晰，支持注释 |
| 团队开发 | 方案五 | 避免配置冲突 |

#### 注意事项

1. **JSON 格式验证**
   - 使用在线工具（如 jsonlint.com）验证 JSON 格式
   - 确保所有引号、逗号、括号正确匹配

2. **环境变量优先级**
   ```
   docker-compose.override.yml > docker-compose.yml > .env 文件
   ```

3. **安全建议**
   - 不要在 git 中提交包含敏感信息的 `.env` 文件
   - 使用 `.env.example` 作为模板
   - 在 `.gitignore` 中添加：
     ```
     .env
     docker-compose.override.yml
     ```

4. **调试技巧**
   ```bash
   # 查看最终的环境变量配置
   docker-compose config
   
   # 查看容器内生成的配置文件
   docker exec sub2api-frontend cat /usr/share/nginx/html/config.js
   
   # 查看容器日志
   docker-compose logs -f frontend
   
   # 验证 JSON 格式
   echo $CUSTOM_MENU_ITEMS | jq .
   ```

5. **多行配置技巧**
   - 在 `.env` 文件中使用反斜杠 `\` 续行
   - 确保每行末尾没有多余空格
   - 最后一行不需要反斜杠

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
