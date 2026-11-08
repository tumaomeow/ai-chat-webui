# AI 工作台

一个轻量的 AI 对话与多模态工作台：

- DeepSeek Flash / V4 Pro 对话
- DeepSeek Files API 文件上传
- 火山方舟 Seedream 图片生成与组图
- 火山方舟 Seedance 视频生成
- 火山方舟 Seed3D 图片生成 3D 模型
- 对话历史按平台 / 模型分组，保存在浏览器 IndexedDB

## 项目结构

```text
public/           前端静态页面
server.js         现有 API 代理与业务逻辑（CommonJS）
local-server.js   本地 Node.js HTTP 入口
worker.mjs        Cloudflare Worker 适配层
wrangler.toml     Cloudflare Workers 配置
```

Worker 通过 `nodejs_compat` 复用 `server.js` 的请求处理逻辑，没有重写 API 业务代码。`worker.mjs` 负责把 Web `Request` / `Response` 适配成 Node 风格的 `req` / `res`。

## 本地运行

```bash
npm install
```

Node.js 本地服务：

```bash
npm start
```

Wrangler 本地 Worker：

```bash
npm run dev
```

Wrangler 默认地址为 `http://localhost:8787`。

## 部署到 Cloudflare Workers

### 方式一：Cloudflare Workers Builds（推荐）

1. 把项目推送到 GitHub。
2. 进入 Cloudflare Dashboard → Workers & Pages → Create application。
3. 选择 Worker，并连接 GitHub 仓库。
4. Build command 填 `npm install`。
5. Deploy command 填 `npx wrangler deploy`。
6. 保存并部署。

`wrangler.toml` 已经配置好：

- `main = "worker.mjs"`
- `compatibility_flags = ["nodejs_compat"]`
- `public/` 静态资源绑定
- SPA 404 回退

### 方式二：本地 Wrangler CLI

```bash
npm install
npx wrangler login
npm run deploy
```

### 方式三：GitHub Actions

仓库已包含 `.github/workflows/deploy.yml`。在 GitHub 仓库 Settings → Secrets and variables → Actions 中添加：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

之后推送到 `main` 会自动执行 `wrangler deploy`。

如果已经使用 Cloudflare Workers Builds，请不要同时启用 GitHub Actions，避免重复部署。

## GitHub 初始化

如果当前目录还不是 Git 仓库：

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

## API Key 与安全

- 项目不包含任何 API Key。
- DeepSeek / 火山方舟 Key 由用户在页面右上角填写，保存在当前浏览器的 `localStorage`。
- Worker 只在请求期间转发 Key，不落盘、不写入日志。
- 公开部署时，访客使用自己的 Key；不要把自己的 Key 写进代码或提交到 GitHub。
- 对话历史保存在浏览器 IndexedDB，不会上传到 Cloudflare。

## Node 兼容模式说明

`wrangler.toml` 启用了：

```toml
compatibility_flags = ["nodejs_compat"]
```

这样可以直接复用 `server.js` 里的 DeepSeek / 火山方舟请求逻辑。当前适配层会把 SSE 和响应体完整缓冲后返回，功能可用，但不是逐字流式输出。如果后续需要原生 Worker 流式响应，只需要把 `/api/deepseek/chat` 单独改成 Worker 原生 `fetch` 流式代理。

## 使用限制

- Cloudflare Worker 适配层限制了约 90 MB 请求体。
- DeepSeek Files API 单文件上限为 64 MiB。
- 多张高分辨率参考图会让火山方舟请求体变大，建议使用较小的参考图或付费套餐。
- Seedance / Seed3D 是异步任务：Worker 只负责创建和查询任务，浏览器负责轮询。
