# 原始基线浏览器记录

日期：2026-08-30  
浏览器：Codex In-app Chromium（固定视口）

## 已采集状态

- `390x844` 首页全页截图：移动导航、Hero、About、项目、Contact/Footer 的原始几何。
- `1440x900` 首页、项目索引、首个项目详情页全页截图。
- 移动菜单：`Toggle menu` 可打开，`Close menu` 可见且可关闭。
- 初始主题：`html.light`；主题按钮可点击。主题依赖客户端状态与过渡，最终稳定态在 Phase 1.5 双主题矩阵中再次断言。
- 页面滚动可用，移动端滚动后无浏览器 console error/warning。
- `/projects/attendance-monitoring-system` 加载后无浏览器 console error/warning。
- 原始 Navbar 包含 active users 和 Messages/chat；这是 Phase 1.5 经批准移除的有意差异。

## 必须在稳定化后复验

- 六个指定视口、双主题以及 initial/scrolled Navbar。
- hover/focus、页面过渡与浏览器后退。
- Testimonials 连续运动、Shoot Mode 进入/瞄准/发射/退出。
- 音频自动播放策略、WebGL 和 fallback。
- 键盘、触摸与 `prefers-reduced-motion`。
- Network 中不再出现 Supabase 请求。

静态截图不能证明动画质量；Phase 1.5 报告必须补充时序与交互检查。Safari/Firefox 仅做兼容检查，不以跨引擎像素一致为标准。
