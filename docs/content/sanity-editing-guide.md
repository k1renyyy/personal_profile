# Sanity 内容编辑与站点构建

## 编辑边界

Sanity 管理当前首页的文案、条目、排序、可见状态和发布状态。Next.js 继续管理布局、颜色、字体、断点、动画和项目切换。

首页“个人介绍照片”引用 3 条“媒体记录”。先在媒体记录中上传图片，填写替代文本、来源、权利状态和原始尺寸，并将用途设为“个人介绍照片”；再回到“首页内容”按左、中、右的顺序选择 3 张。未配置时网站保留占位图。

当前项目模型与已确认设计一致：

- 首页内切换，不跳转。
- 不显示 Year。
- Capabilities 固定在内容框底部。
- 首页固定读取 3 个可见项目。

Experience 只显示公司、职位、时间和成果；不显示 location。最多发布 3 条可见经历，每条最多 4 项成果。

Testimonials 只有在授权状态为“已明确授权”且“在网站显示”时才会出现；没有合格内容时整个区块隐藏。

## 启动 Studio

Studio 使用 Sanity 项目 `foow59ov` 的 `production` dataset。在 `studio/` 目录中配置：

```text
SANITY_STUDIO_PROJECT_ID=foow59ov
SANITY_STUDIO_DATASET=production
```

然后运行：

```bash
cd studio
npm ci
npm run dev
```

登录有该 Sanity 项目编辑权限的账号后，可在中文导航中编辑首页、工作经历、项目和 Testimonials。

## 内容就绪顺序

1. 完成并发布单例文档：站点设置、个人资料、首页内容。
2. 完成并发布 1–3 条可见 Experience。
3. 完成并发布 3 个可见 Project，排序值必须唯一。
4. 确保 Email、GitHub 和 LinkedIn 已发布且顺序唯一。
5. Testimonials 仅发布已取得公开授权的内容。

## 网站构建

只在上述必需内容都已发布后，在网站构建环境配置：

```text
SANITY_PROJECT_ID=foow59ov
SANITY_DATASET=production
```

然后运行 `npm run build`。查询或验证失败会终止构建，不会自动回退或混用仓库旧内容。

## 发布时效

网站是 Next.js 静态导出。Sanity 中点击 Publish 后，必须触发新的网站构建才会出现在线上页面。本地可重新运行 `npm run build`。托管环境的 Sanity webhook 与原子部署需在部署阶段配置。
