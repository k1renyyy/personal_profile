# Phase 3C：平台中立内容模型

日期：2026-08-30
状态：已批准，可进入 Phase 3D 内容收集
目标平台：Sanity（Phase 3E PoC 前不创建账号、不安装依赖、不修改生产内容源）

## 1. 已批准的范围

第一版内容系统管理九类内容：

1. 个人资料
2. 首页文案
3. 技术能力
4. 工作经历
5. 客户/同事推荐语
6. 项目经历
7. 联系方式
8. 图片
9. SEO

Achievements 从页面和内容模型中移除。X/Twitter 从联系方式、Footer、Contact 与 Floating Socials 中移除。原首页 Featured Work 区块改为纯文字工作经历；原 Recognition & Milestones 卡片区改为桌面端三列项目经历；Testimonials 区块保留并只发布真实、获授权的推荐语。

## 2. 内容与表现边界

内容系统控制：文字、记录顺序、公开状态、图片及其元数据、SEO。

Next.js 代码继续唯一控制：

- DOM、Tailwind、断点和页面区块顺序；
- GSAP、Motion、Anime.js、Lenis、Shoot Mode、音频和 WebGL；
- section id、动画 class、`data-shoot-*` 与路由行为；
- 图片渲染、裁切算法、sizes、priority 与 lazy loading；
- 工作经历的左右排版、项目卡片展开行为和 Testimonials 循环实现；
- 动态年份、时钟、主题和运行时状态。

后台不得注入 HTML、class、脚本、iframe、动画参数或任意样式代码。

## 3. 建模方式

采用已批准的混合模型：

- 单例：个人资料、首页文案、联系方式、SEO；
- 有序记录集合：技术能力、工作经历、推荐语、项目经历、图片；
- 页面不使用自由拖拽 Page Builder。

## 4. 字段定义

### 4.1 个人资料 `profile`

| 字段 | 类型 | 规则 |
|---|---|---|
| `name` | 短文本 | 必填；正式显示姓名 |
| `englishName` | 短文本 | 可选 |
| `professionalTitle` | 短文本 | 必填；不得包含表现代码 |
| `locations` | 有序短文本数组 | 必填，至少一项；允许展示多个常驻/活动地点 |
| `timezone` | 短文本 | 必填；使用可读时区名称 |
| `availability` | 短文本 | 必填 |
| `shortBio` | 文本 | 必填；用于紧凑区域 |
| `fullBio` | 受控富文本 | 必填 |
| `interests` | 有序短文本数组 | 可选 |
| `portrait` | 图片引用 | 必填；引用带权利信息的图片记录 |
| `resume` | 文件或 HTTPS URL | 可选 |

个人资料下包含有序教育经历 `education`：

| 字段 | 类型 | 规则 |
|---|---|---|
| `institution` | 短文本 | 必填；学校或教育机构名称 |
| `degree` | 短文本 | 必填；如本科、硕士或学位名称 |
| `fieldOfStudy` | 短文本 | 必填；专业或研究方向 |
| `location` | 短文本 | 可选 |
| `startDate` | 年月 | 可选 |
| `endDate` | 年月 | 可选；在读时可填写预计毕业年月 |
| `description` | 文本 | 可选；只记录需要公开的重点 |
| `order` | 整数 | 必填；多条学历使用稳定顺序 |

### 4.2 首页文案 `homeCopy`

| 字段 | 类型 | 规则 |
|---|---|---|
| `heroTitleLines` | 两项短文本数组 | 必须恰好两项 |
| `heroNameLines` | 两项短文本数组 | 必须恰好两项 |
| `regionLine` | 短文本 | 必填 |
| `valuePropositionLines` | 两项短文本数组 | 必须恰好两项 |
| `collaborationLine` | 短文本 | 必填 |
| `selectedWorkLabel` | 短文本 | 保留为内容标签；目标 anchor 由代码控制 |
| `aboutParagraphs` | 三项文本数组 | 必须恰好三项 |
| `services` | 有序短文本数组 | 必填；桌面/移动使用同一来源 |
| `focusAreas` | 有序短文本数组 | 必填 |
| `contactTitleLines` | 两项短文本数组 | 必须恰好两项 |
| `contactInvitation` | 文本 | 必填 |

### 4.3 技术能力 `skill`

| 字段 | 类型 | 规则 |
|---|---|---|
| `name` | 短文本 | 必填且唯一 |
| `category` | 枚举 | `product-research`、`ai-application`、`data-tools`、`language` |
| `icon` | 图片引用 | 可选；必须是经批准的图标资产 |
| `placements` | 枚举数组 | `hero`、`stack`、`marquee` |
| `order` | 整数 | 必填；同一展示位置内唯一 |
| `isVisible` | 布尔值 | 必填 |

### 4.4 工作经历 `workExperience`

| 字段 | 类型 | 规则 |
|---|---|---|
| `company` | 短文本 | 必填 |
| `role` | 短文本 | 必填 |
| `location` | 短文本 | 必填 |
| `startDate` | 年月 | 必填 |
| `endDate` | 年月 | 与 `isCurrent` 二选一 |
| `isCurrent` | 布尔值 | 为真时不填写结束日期 |
| `description` | 文本 | 必填 |
| `highlights` | 有序文本数组 | 必填，至少一项 |
| `order` | 整数 | 必填且唯一 |
| `isPublished` | 布尔值 | 未公开经历可保存草稿 |

首页使用原 Featured Work 的宽阔左右构图：左侧为标题和区块介绍，右侧直接显示全部经历文字。删除图片、缩略图、图片切换、项目打字标题、技术标签覆盖层、图片 scrub 和项目点击导航。保留的动画仅为代码控制的轻量文字显现。

### 4.5 推荐语 `testimonial`

| 字段 | 类型 | 规则 |
|---|---|---|
| `personName` | 短文本 | 必填 |
| `role` | 短文本 | 必填 |
| `company` | 短文本 | 可选 |
| `relationship` | 短文本 | 必填，如客户、同事、主管 |
| `quote` | 文本 | 必填 |
| `portrait` | 图片引用 | 可选；缺失时使用代码定义回退 |
| `date` | 年月 | 可选 |
| `authorizationStatus` | 枚举 | `missing`、`requested`、`approved`、`revoked` |
| `order` | 整数 | 必填且唯一 |
| `isPublished` | 布尔值 | 只有 `approved` 才能为真 |

不保留星级评分，不发布当前模板中的示例姓名或推荐语。

### 4.6 项目经历 `project`

后台向所有者展示六个内容字段：

| 字段 | 类型 | 规则 |
|---|---|---|
| `name` | 短文本 | 必填 |
| `role` | 短文本 | 必填 |
| `year` | 四位年份 | 必填 |
| `summary` | 文本 | 必填；卡片默认显示 |
| `description` | 受控富文本 | 必填；卡片展开后显示 |
| `highlights` | 有序文本数组 | 必填，至少一项；卡片展开后显示 |

系统仍可保存内部文档 ID 和明确的 `order`/`isPublished` 管理字段，但不要求所有者填写 URL slug、技术标签、图片、GitHub、在线链接或项目 SEO。

原 Recognition & Milestones 卡片区改为项目经历：桌面端使用三列布局，默认显示年份、角色、名称和摘要；点击卡片在原位置展开详细介绍和亮点，不能导航到独立详情页。移动端为单列展开。删除 `/projects/[slug]` 的产品需求；是否保留 `/projects` 聚合路由在生产实现设计中根据导航审计处理，但不得重新引入详情页。

### 4.7 联系方式 `contact`

| 字段 | 类型 | 规则 |
|---|---|---|
| `email` | Email | 必填且全站唯一来源 |
| `phone` | 电话文本 | 可选；仅在所有者明确同意公开时显示 |
| `github` | HTTPS URL | 可选 |
| `linkedin` | HTTPS URL | 可选 |
| `instagram` | HTTPS URL | 可选 |
| `otherLinks` | 有序对象数组 | 可选；平台名、URL、是否显示、顺序 |

不存在 X/Twitter 字段。各展示位置使用同一来源并由代码选择子集。

### 4.8 图片 `mediaRecord`

| 字段 | 类型 | 规则 |
|---|---|---|
| `asset` | 原始图片资产 | 必填 |
| `label` | 后台名称 | 必填 |
| `alt` | 文本 | 面向内容图片时必填 |
| `caption` | 文本 | 可选 |
| `source` | 文本或 URL | 必填 |
| `rightsStatus` | 枚举 | `unknown`、`owned`、`licensed`、`permission-granted`、`restricted` |
| `attribution` | 文本 | 许可要求时必填 |
| `placements` | 枚举数组 | 必填 |
| `focalPoint` | 热点/裁切 | 可选 |

宽度、高度和比例从资产自动读取。`unknown` 或 `restricted` 不得正式发布。Shoot Mode GLB、技术表现资产和未使用旧图片不进入普通编辑媒体库，但在 Phase 3D 权利清单中记录。

### 4.9 SEO `seoSettings`

| 字段 | 类型 | 规则 |
|---|---|---|
| `siteTitle` | 短文本 | 必填 |
| `siteDescription` | 文本 | 必填 |
| `canonicalUrl` | HTTPS URL | 必填；不得回退到参考站 |
| `defaultShareImage` | 图片引用 | 必填；适合横向社交分享 |
| `allowIndexing` | 布尔值 | 正式域名准备完成前默认关闭 |
| `socialName` | 短文本 | 必填 |

第一版没有项目详情页，因此不设置逐项目 SEO。

## 5. 发布与校验规则

- 缺失必填内容时允许保存草稿，但不得正式发布。
- 引用图片缺失 alt、来源或权利状态时不得发布。
- 推荐语未获明确授权时不得发布。
- 排序使用显式整数或后台拖动产生的稳定顺序，不依赖创建时间。
- 删除被引用图片前必须阻止操作或显示明确引用警告。
- 富文本只允许标题、段落、列表、链接和强调。
- Sanity 草稿不得出现在公开查询中，读写 token 不进入正式客户端 bundle。
- 保持 `output: "export"` 时，发布触发 Vercel 完整重建；已上线站点保留最后一次成功构建。

## 6. Phase 3C 批准记录

- 采用混合模型：已确认。
- 工作经历纳入第一版：已确认。
- 学历作为个人资料的有序子栏目：已确认。
- Featured Work 改为宽阔纯文字工作经历：已确认。
- Recognition & Milestones 改为可原地展开的项目经历卡片：已确认。
- 不创建项目详情页：已确认。
- Achievements 移除、Testimonials 保留：已确认。
- X/Twitter 删除：已确认。
- 电话公开展示：已确认。

本模型已覆盖 Phase 3A 审计中仍保留的生产内容消费者，并明确记录被取消消费者。可以进入 Phase 3D 内容与媒体收集。
