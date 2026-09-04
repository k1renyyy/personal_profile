# Portfolio 原始基线报告

日期：2026-08-30

## 可恢复点

- 本地导入提交：`dae2155`
- annotated tag：`portfolio-v3-import-baseline`
- 审计的上游提交：`b945ba21f41fde05bdb440c2c24e68d5e4337030`
- 开发分支：`personal-development`

对 `app/`、`components/`、`lib/`、`public/`、`package.json` 和 `package-lock.json` 执行提交间 diff，没有产品源码差异；上游差异仅涉及本地 agent skill 文件，因此 `dae2155` 可作为产品基线。

## 工具链

- Node.js `v24.15.0`
- npm `11.12.1`
- Next.js `16.2.4`
- React / React DOM `19.2.3`
- ESLint `9.x`
- `eslint-config-next` `16.1.4`

## 原始工程状态

- `npm run build`：通过，生成 `/`、`/projects` 和 7 个项目详情路由。
- `npm run lint -- --max-warnings=0`：失败，33 errors / 15 warnings。这是上游源码已有问题，不是本地个性化改动引入。
- `npm audit --audit-level=low`：失败；原始审计包含 direct、development 和 transitive 风险，Phase 1.5 要求全部清零。
- HTTP 路由检查：9/9 返回 200，见 `routes.txt`。

## 视觉与交互证据

截图位于 `docs/baseline/screenshots/`：

- `home-390x844.png`
- `home-1440x900.png`
- `projects-1440x900.png`
- `project-detail-1440x900.png`

交互观察和仍需复验的矩阵见 `browser-notes.md`。截图与笔记只用于比较和审计，不进入 `public/`，不会成为生产资产。

## 已知风险归属

- lint/React 规则问题：来自审计上游产品源码。
- dependency advisories：来自导入的依赖树及锁文件。
- Supabase chat/presence/cursors：原产品功能，但与目标个人站范围冲突，经批准在 Phase 1.5 提前移除。
- 缺失 license 与第三方资产权利：属于发布风险；到 Phase 2 为止不宣称拥有公开再分发权。
