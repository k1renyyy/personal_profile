# Portfolio 基线稳定化报告

日期：2026-08-30  
分支：`personal-development`  
范围：开发路线图 Phase 1.5

## 结论

导入的 `portfolio-v3` 基线已经完成工程稳定化。已批准移除的 Supabase 实时功能不再存在；源码、依赖树、生产静态导出和自动化浏览器回归均达到 Phase 1.5 的严格门槛。个人身份、文案、项目内容和视觉设计尚未进入修改范围。

## 风险处理结果

- Supabase：聊天、在线人数、Presence、协作光标、浏览器客户端、迁移文件和运行时依赖已删除；自动化网络监听未发现 Supabase 请求。
- ESLint 与 TypeScript：原始 33 errors / 15 warnings 已全部修复，没有新增规则关闭、忽略项或仅为过门禁加入的 suppression。
- React：修复 Rubik 非确定性首屏、主题 Hydration、渲染期 Ref、同步 Effect 派生状态、Hook 闭包和 Contact 自引用初始化问题。
- 依赖安全：Next.js 与配套 lint 包升级到 `16.3.3`；删除不可达的 `face-api.js`、TensorFlow/GridScan 代码；传递依赖升级到已修复版本。
- 生产运行：静态导出由 `serve out` 提供，避免把 `next start` 错用于 `output: "export"`。
- 项目列表 Hydration：将用于 Navbar 渲染判断的路径去除尾斜杠，避免 `/projects/` 被客户端误判为项目详情页。
- GitHub star：删除匿名运行时 API 请求，保留相同的静态 `1,017` 展示，避免限流 403 污染 Console 或让 Navbar 依赖第三方实时可用性。

## 最终工具链

- Node.js：`v24.15.0`
- npm：`11.12.1`
- Next.js：`16.3.3`
- React / React DOM：`19.2.3`
- ESLint：`9.39.2`
- Playwright：`1.62.1`

## 正式质量门禁

以下链路从 `npm ci` 开始连续执行并通过：

```bash
npm ci
npm run lint -- --max-warnings=0
npm audit --audit-level=low
npm run build
npm run test:e2e
```

结果：

- 干净安装：成功，安装并审计 531 个包。
- ESLint：0 errors / 0 warnings。
- npm audit：0 vulnerabilities。
- Next.js 生产构建：成功，TypeScript 检查通过。
- 业务路由：`/`、`/projects` 和 7 个静态项目详情页全部生成。
- Playwright：6 passed，6 skipped；跳过项是仅在固定 Chromium 执行的视口、触摸及时间型交互用例在 Firefox/WebKit 项目中的预期跳过，不是失败或未执行的路由兼容检查。

## 浏览器回归范围

### 三浏览器路由检查

Chromium、Firefox 和 WebKit 均检查全部 9 条业务路由。每次导航等待网络静默后断言：

- 主文档状态码小于 400；
- 页面正文非空；
- 无 Console error/warning；
- 无未捕获页面异常；
- 无本地 GET、脚本、样式或图片加载失败；
- 无本地 4xx/5xx 响应；
- 无 Supabase 请求。

Next.js 客户端路由预取会主动取消部分 `HEAD` 探测请求。测试只把 `HEAD + net::ERR_ABORTED` 这一精确组合归为预期取消，其他网络失败仍会使测试失败。

### Chromium 交互矩阵

- 视口：`390x844`、`430x932`、`768x1024`、`1024x768`、`1440x900`、`1920x1080`。
- 主题：每个视口验证主题切换能改变稳定的 HTML 主题状态。
- 键盘：移动菜单可由 Enter 打开和关闭。
- Reduced Motion：浏览器媒体查询被实际模拟并确认生效。
- Shoot Mode：开关状态、WebGL Canvas 创建、射击和退出均通过。
- 音频：用户手势后创建 AudioContext，并确认真实 AudioBufferSource 启动。
- Testimonials：连续运动样式随时间发生变化。
- 触摸：真实 touch context 中验证菜单、Shoot Mode、触摸射击、项目进入和浏览器返回。

## 浏览器与硬件容差

Playwright 的 Chromium 虚拟 GPU 在 WebGL `ReadPixels` 时可能输出 `GPU stall due to ReadPixels` 性能诊断。该信息满足以下条件：

- 来源为 GL Driver Message；
- WebGL Canvas 已成功创建；
- Shoot Mode 和射击交互正常；
- 没有应用异常堆栈。

测试只允许这一条精确驱动诊断格式，并把它与应用错误分开记录。任何其他 Console warning/error 仍然失败。字体光栅化、GPU 输出、刷新率和音频自动播放策略继续按设计文档中的跨设备容差处理。

## 视觉证据

稳定化截图位于 `docs/baseline/stabilized-screenshots/`，覆盖六个规定视口。截图用于审计首页构图和响应式边界，不作为动画质量的唯一证明；固定、滚动和循环动画由实际浏览器交互检查补充验证。

与原始 Phase 1 基线相比，唯一计划内的可见差异是 Navbar 不再显示 Supabase 聊天、在线人数和协作状态。主题、GitHub、菜单和 Shoot Mode 控件保留。

## 已知但不阻断 Phase 1.5 的事项

- `@studio-freight/lenis` 安装时提示包名已迁移到 `lenis`。当前版本没有安全漏洞，替换包名会改变既有滚动依赖边界，因此本阶段不做无风险依据不足的库迁移。
- 上游仓库缺少明确许可证，第三方图片、字体、模型和其他资产的公开再分发权仍需在内容资产清单和发布前确认。这是发布授权风险，不是本地构建缺陷。

## Phase 1.5 判定

所有明确验收项均有当前源码、锁文件、构建输出、浏览器测试或保留截图作为证据。Phase 1.5 可以关闭，并进入 Phase 2 仓库规范提交。
