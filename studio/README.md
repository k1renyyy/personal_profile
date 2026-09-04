# Kiren Portfolio CMS

这个 Sanity Studio 同时支持正式 `production` dataset 和隔离的 `poc` dataset。

## 正式内容编辑

```bash
cp .env.example .env.local
npm ci
npm run dev
```

`.env.example` 只包含 Sanity Project ID 和 dataset 名称，它们是公开标识符，不是密钥。

## PoC 隔离检查

不修改本地环境文件，可以用一条命令临时连接 `poc`：

```bash
SANITY_STUDIO_PROJECT_ID=foow59ov SANITY_STUDIO_DATASET=poc npm run dev
```

## 安全边界

- 不要把 API 读取 Token、写入 Token、预览 Token 或 webhook secret 放入 `.env.example`、`.env.local` 或任何 `SANITY_STUDIO_*` 变量。
- Studio 的登录账号负责编辑和发布；公开网站构建只读取已发布内容。
- 正常编辑使用 `production`；`poc` 仅用于隔离验证。

完整字段边界、内容就绪顺序和网站切换方法见 `../docs/content/sanity-editing-guide.md`。

## 检查命令

```bash
SANITY_STUDIO_PROJECT_ID=foow59ov SANITY_STUDIO_DATASET=production npm test
SANITY_STUDIO_PROJECT_ID=foow59ov SANITY_STUDIO_DATASET=production npm run typecheck
SANITY_STUDIO_PROJECT_ID=foow59ov SANITY_STUDIO_DATASET=production npm run lint
SANITY_STUDIO_PROJECT_ID=foow59ov SANITY_STUDIO_DATASET=production npm run build
```
