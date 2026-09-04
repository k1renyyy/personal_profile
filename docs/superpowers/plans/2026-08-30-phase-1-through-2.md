# Phase 1–2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完成并验证路线图 Phase 1、Phase 1.5 和 Phase 2，得到可恢复、零 lint 告警、零已知依赖漏洞、无 Supabase 实时功能且仓库规范已纳入版本控制的稳定基线。

**Architecture:** 保留现有 Next.js App Router、React、Tailwind、GSAP、Lenis、Motion、Three.js/R3F 结构。先固化原始基线证据，再按“实时后端移除、确定性 lint、React 行为、依赖安全、全量回归、仓库规范”分离提交，避免把视觉变化与工程修复混在一起。

**Tech Stack:** Next.js 16、React 19、TypeScript、ESLint 9、Tailwind CSS 4、GSAP/ScrollTrigger、Lenis、Motion/Framer Motion、Three.js/R3F、Playwright/Chromium、npm audit。

**Spec:** `docs/superpowers/specs/2026-08-30-baseline-stabilization-design.md`

## Global Constraints

- 只在 `personal-development` 工作；保留 `main` 和 `portfolio-v3-import-baseline`。
- `npm run lint -- --max-warnings=0` 必须零错误零告警。
- `npm audit --audit-level=low` 必须零已知漏洞，包括开发和传递依赖。
- 不使用 `npm audit fix --force`，不新增 ESLint 禁用、忽略或压制。
- 删除 Supabase chat、presence、collaborative cursors 及其依赖，但保留 Navbar 尺寸、导航、主题、Shoot Mode 和响应式平衡。
- 不接受未经审阅的视觉基线更新；所有有意差异必须写入基线报告。
- 每个风险类别独立提交；不混入个人内容或无关重构。

---

### Task 1: 固化 Phase 1 基线证据

**Files:**
- Create: `docs/baseline/baseline-report.md`
- Create: `docs/baseline/routes.txt`
- Create: `docs/baseline/screenshots/*.png`
- Create: `docs/baseline/browser-notes.md`
- Modify: `docs/development-roadmap.md`

**Interfaces:**
- Consumes: baseline tag `portfolio-v3-import-baseline`, upstream commit `b945ba21f41fde05bdb440c2c24e68d5e4337030`.
- Produces: 后续所有视觉和行为修复的不可变比较证据。

- [ ] **Step 1: 记录工具链、提交、上游差异和原始 lint/audit/build 结果**

Run: `node --version && npm --version && git rev-parse HEAD && git diff --stat dae2155 b945ba21f41fde05bdb440c2c24e68d5e4337030 -- app components lib public package.json package-lock.json`

Expected: 报告中包含版本、提交、产品源码差异结论和原始 33 errors/15 warnings、audit 风险、build 状态。

- [ ] **Step 2: 枚举并请求所有静态路由**

Run: `npm run build`，再启动 `npm run start` 并对 `/`、`/projects` 和 `app/data/projects.ts` 中的全部 slug 发出 HTTP 请求。

Expected: 每个路由返回 HTTP 200，完整清单写入 `docs/baseline/routes.txt`。

- [ ] **Step 3: 在固定 Chromium 视口采集原始截图与交互记录**

Run: 使用 Playwright/Chromium 检查 `390x844`、`430x932`、`768x1024`、`1024x768`、`1440x900`、`1920x1080`，保留首页、项目页、项目详情页代表截图，并记录主题、菜单、滚动、过渡、Testimonials、Shoot Mode、声音、WebGL、键盘和 reduced-motion。

Expected: 截图位于 `docs/baseline/screenshots/`，限制与观察写入 `docs/baseline/browser-notes.md`。

- [ ] **Step 4: 标记 Phase 1 并提交**

Run: `git add docs/baseline docs/development-roadmap.md && git commit -m "chore: capture and document portfolio baseline"`

Expected: Phase 1 验收项全部有证据且独立提交。

### Task 2: 移除 Supabase 实时功能

**Files:**
- Delete: `app/components/collaborative-cursors.tsx`
- Delete: `lib/supabase-browser-client.ts`
- Delete: `supabase/migrations/*`
- Modify: `app/layout.tsx`
- Modify: `app/components/navbar/app-navbar.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: Navbar 现有导航、主题和 Shoot Mode DOM/样式。
- Produces: 不依赖环境变量或网络后端的静态 Navbar，且无 Supabase 代码、包和请求。

- [ ] **Step 1: 写并运行 Supabase 缺席检查，使其先失败**

Run: `! rg -n "supabase|chat_messages|portfolio-site-cursors|collaborative-cursors" app components lib package.json package-lock.json supabase`

Expected: FAIL，因为现有源码和依赖仍引用 Supabase。

- [ ] **Step 2: 删除 realtime 组件、Navbar chat/presence UI 与运行时代码并卸载依赖**

Run: `npm uninstall @supabase/supabase-js`，仅删除由实时功能产生的代码和孤立辅助代码。

Expected: Navbar 导航、主题、Shoot Mode 和响应式结构保留。

- [ ] **Step 3: 运行缺席检查、lint、build 和路由烟测**

Run: `! rg -n "supabase|chat_messages|portfolio-site-cursors|collaborative-cursors" app components lib package.json package-lock.json supabase && npm run lint -- --max-warnings=0; npm run build`

Expected: Supabase 检查 PASS；lint 只剩非 Supabase 既有问题；build PASS。

- [ ] **Step 4: 提交**

Run: `git add -A && git commit -m "refactor: remove supabase realtime features"`

Expected: 仅包含 realtime 移除和依赖锁文件变化。

### Task 3: 修复确定性 lint 问题

**Files:**
- Modify: ESLint 报告中含 `no-explicit-any`、`no-unescaped-entities`、`no-unused-vars`、`prefer-const`、`no-img-element`、`ban-ts-comment`、`exhaustive-deps` 的源文件。

**Interfaces:**
- Consumes: Task 2 的无 Supabase 源码。
- Produces: 不改变可观察 UI 的类型、实体、导入、图片和 Hook 依赖修复。

- [ ] **Step 1: 保存机器可读 lint 清单并确认失败**

Run: `npx eslint . --max-warnings=0 -f json > /tmp/portfolio-eslint.json`

Expected: 非零退出，JSON 中每个剩余问题均可映射到文件、行和规则。

- [ ] **Step 2: 逐类做最小修复**

Replace: `any` 使用库类型或 `unknown`+narrowing；Rubik key 使用类型化集合；JSX 字符实体转义；只删除确实未使用项；未重赋值改 `const`；在不改变图片行为时使用 `next/image`；Hook 回调/依赖按实际生命周期稳定化。

- [ ] **Step 3: 验证 lint 零问题并检查视觉代表页**

Run: `npm run lint -- --max-warnings=0 && npm run build`

Expected: 两个命令均退出 0，浏览器代表截图无未经批准差异。

- [ ] **Step 4: 提交**

Run: `git add app components lib && git commit -m "fix: resolve deterministic lint violations"`

Expected: 提交不含 React 状态流或依赖升级。

### Task 4: 稳定 React 渲染和动画行为

**Files:**
- Modify: `app/components/app-rubiks.tsx`
- Modify: `app/components/page-transition.tsx`
- Modify: `app/components/sections/projects.tsx`
- Modify: `app/components/sections/contact.tsx`
- Modify: `app/hooks/useGSAP.ts`
- Modify: 仍被 React hooks purity/refs/set-state-in-effect/immutability 报告命中的文件。

**Interfaces:**
- Consumes: 现有 Rubik、项目标题、route transition、Contact ScrollTrigger 和 `useGSAP` 行为。
- Produces: 确定渲染、无 render-time ref 读取、无同步 effect 派生状态、类型安全且无 stale closure 的动画生命周期。

- [ ] **Step 1: 对每个风险建立可失败检查**

Run: lint 精确规则检查，并在浏览器记录 Rubik 点击前后、项目标题切换、路由滚动锁、Contact 进入触发和 reduced-motion 状态。

Expected: 修复前 lint 或行为断言至少一项失败，失败原因与目标风险一致。

- [ ] **Step 2: 做最小状态流修复**

Implement: Rubik 随机目标只在事件/初始化时生成；可渲染值使用 state/直接派生；mount/外部订阅通过 lazy initializer 或订阅回调更新；Contact 传入独立 ref；`useGSAP` 使用明确 callback/dependency 类型与 cleanup。

- [ ] **Step 3: 验证风险检查、strict lint、build 与代表交互**

Run: `npm run lint -- --max-warnings=0 && npm run build`

Expected: 零问题，Rubik/Shoot Mode、项目标题、滚动锁、Contact/reduced-motion 行为通过。

- [ ] **Step 4: 提交**

Run: `git add app components lib && git commit -m "fix: stabilize react rendering behavior"`

Expected: React 行为修复独立可回退。

### Task 5: 将依赖漏洞降为零

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify/Delete: 仅因不可达漏洞依赖移除而成为孤立的代码。

**Interfaces:**
- Consumes: `npm audit --json` 的直接依赖路径。
- Produces: 支持版本的依赖树，低危及以上漏洞为零。

- [ ] **Step 1: 保存 audit 图并确认失败**

Run: `npm audit --json > /tmp/portfolio-audit.json`

Expected: 非零退出，记录每条 advisory 的父依赖链。

- [ ] **Step 2: 逐依赖族升级或删除**

Order: Next/ESLint 配套；PostCSS；Sharp；ws/brace-expansion/js-yaml/node-fetch；检查 `face-api.js`/TensorFlow 是否从产品代码可达，可达则升级并回归，不可达则移除对应依赖及仅由它产生的孤立代码。

- [ ] **Step 3: 每个依赖族执行完整门禁**

Run: `npm run lint -- --max-warnings=0 && npm audit --audit-level=low && npm run build`

Expected: 最终 audit 显示 0 vulnerabilities，lint/build 退出 0。

- [ ] **Step 4: 提交**

Run: `git add package.json package-lock.json app components lib && git commit -m "chore: remediate dependency vulnerabilities"`

Expected: 依赖和必要兼容修复组成独立提交。

### Task 6: 完成 Phase 1.5 全量回归证据

**Files:**
- Create: `docs/baseline/stabilization-report.md`
- Create: `docs/baseline/stabilized-screenshots/*.png`
- Modify: `docs/development-roadmap.md`

**Interfaces:**
- Consumes: Task 1 原始基线、Task 2–5 稳定代码。
- Produces: Phase 1.5 每一验收项的证据映射。

- [ ] **Step 1: 从干净依赖安装运行三项永久门禁**

Run: `npm ci && npm run lint -- --max-warnings=0 && npm audit --audit-level=low && npm run build`

Expected: 全部退出 0，audit 为 0 vulnerabilities。

- [ ] **Step 2: 跑全路由、全视口、双主题和交互矩阵**

Run: 固定 Chromium 自动检查所有路由 HTTP/console/network/assets、六个视口、主题、导航、hover/focus、过渡、Testimonials、Shoot Mode、音频、WebGL、touch/keyboard/reduced-motion；Safari/Firefox 做兼容检查（环境不可用项必须明确记录，不能伪造通过）。

Expected: 无无法解释 console/network 错误，无 Supabase 流量；稳定区域与 Phase 1 证据一致，差异均有原因。

- [ ] **Step 3: 写报告并标记 Phase 1.5**

Expected: `stabilization-report.md` 对每个验收项链接到命令输出、截图或人工检查记录；路线图 Phase 1.5 勾选。

- [ ] **Step 4: 提交**

Run: `git add docs/baseline docs/development-roadmap.md && git commit -m "test: verify stabilized portfolio baseline"`

Expected: 只包含验证证据与进度状态。

### Task 7: 完成 Phase 2 仓库规范

**Files:**
- Add: `AGENTS.md`
- Modify: `docs/development-roadmap.md`

**Interfaces:**
- Consumes: 已审阅的永久 coding/testing/security/commit 规则。
- Produces: Git 跟踪的永久仓库规范；路线图只保留时限性实施顺序。

- [ ] **Step 1: 审查职责边界**

Run: `rg -n "personal content|Phase [0-9]|temporary|临时" AGENTS.md`

Expected: `AGENTS.md` 不含个人内容或阶段性执行清单；路线图不重复永久编码规范正文。

- [ ] **Step 2: 标记 Phase 2 并提交**

Run: `git add AGENTS.md docs/development-roadmap.md && git commit -m "docs: add repository guidelines"`

Expected: `AGENTS.md` 被 Git 跟踪且 Phase 2 勾选。

- [ ] **Step 3: 最终完成审计**

Run: `git status --short --branch && git log --oneline portfolio-v3-import-baseline..HEAD && npm run lint -- --max-warnings=0 && npm audit --audit-level=low && npm run build`

Expected: 工作树干净；Phase 1、1.5、2 均有独立提交和逐项证据；三项门禁全部退出 0。
