# Phase 3F：正式 Sanity 内容基础与网站查询层设计

## 目的

将 Phase 3E 的有界 PoC 转换为 Phase 4–7 可逐步使用的正式内容基础，同时保持现有网站默认读取仓库内容，不改变页面输出、布局、DOM、路由、响应式行为、动画、Shoot Mode、音频或 WebGL。

本阶段建立正式 dataset、完整 schema、Studio 编辑体验、类型化查询与验证层、故障和恢复规则。它不迁移完整正式内容，不部署网站，不创建 Vercel 项目或线上 webhook，也不把 `cms_build` 合并到其他分支。

## 已批准决策

- 继续使用 Sanity 项目 `foow59ov`。
- 在该项目中新建公开读取的 `production` dataset；保留 `poc` 作为隔离测试环境。
- `production` 只保存准备公开展示的内容。公开读取不授予草稿读取、写入、Studio 登录或账号权限。
- 已接入 Sanity 的内容域遇到查询或验证失败时，构建严格失败；不自动混用或静默回退到仓库旧内容。
- 仓库内容保留为明确、人工触发的回滚源。
- 使用“单例配置 + 独立内容文档”的混合文档模型。
- Studio 和环境配置、查询与失败处理、验证与运维边界均已由站点所有者批准。

## 架构边界

### Sanity 负责

- 站点所有者可编辑的文案、链接、事实、排序、可见状态和发布状态。
- 已获授权的媒体及其替代文本、来源、权利、尺寸、比例和用途元数据。
- 草稿和已发布版本的内容生命周期。
- Testimonials 的真实内容与公开授权状态。

### Next.js 负责

- 页面结构、DOM、Tailwind 样式、断点、媒体渲染和组件组合。
- Experience 和 Project 的折叠、展开、一次只展开一项、桌面与移动端行为和动画。
- 路由、静态导出、Shoot Mode、音频、WebGL 和所有非内容交互状态。
- 将已验证的 Sanity 数据映射为稳定的页面接口。

Sanity 不作为页面构建器，不保存任意 HTML、脚本、样式、动画参数、组件名称或响应式布局指令。

## Dataset 与访问模型

`production` 和 `poc` 位于同一 Sanity 项目，但用途严格隔离：

- `production`：正式内容，公开读取，只允许通过已授权 Sanity 账号编辑。
- `poc`：Phase 3E 记录和后续隔离验证，不作为正式网站内容源。

正常静态构建只需要 Project ID、dataset 和固定 API 日期，不使用读取 Token。查询使用 `perspective: "published"`，并在 GROQ 中显式排除 `drafts.*`。浏览器不直接查询 Sanity。

写入 Token、草稿预览 Token 和 webhook secret 不进入 `NEXT_PUBLIC_*` 变量、客户端 bundle 或 Git。Phase 11 才设计并配置托管 webhook。

固定 API 日期为 `2026-08-30`。构建查询使用 `useCdn: false`，以读取最新已发布内容。

## 正式内容模型

### 单例文档

#### `siteSettings`

- 网站标题、描述、正式 HTTPS URL、社交分享名称和是否允许索引。
- 默认分享媒体引用在正式分享图完成前可为空；允许索引前必须存在且通过媒体权利验证。
- 单例固定文档 ID，Studio 不允许创建重复记录。

#### `profile`

- 中文姓名、英文姓名、职业名称、地点、时区、合作状态、简短介绍和完整介绍。
- 头像媒体引用可在正式接入头像前保持明确缺失；不得以参考人物资产填补。
- 单例固定文档 ID。

#### `homepage`

- Hero 两行职业标题、两行姓名显示、地区短句、两行价值主张、合作状态和主按钮文案。
- About 段落、Experience/Project/Testimonial 区块标题与介绍、Contact 两行标题和邀请文案。
- 只保存可编辑内容，不保存布局、组件、断点或交互状态。
- 单例固定文档 ID。

### 独立且可排序的文档

#### `education`

- 机构、学位、专业、地点、开始年月、结束年月、预计完成状态、说明、成果/课程/荣誉、相关链接、`order` 和 `isVisible`。

#### `experience`

- 公司、职位、部门、地点、开始年月、结束年月或“至今”、完整介绍、成果列表、`order` 和 `isVisible`。
- 当前真实内容不要求图片。
- 展开摘要如可由现有已批准内容稳定映射，不新增重复文案字段；后续交互设计若证明需要独立摘要，再通过审查后的 schema 增量添加。

#### `capabilityGroup`

- 分组名称、能力条目、展示位置、`order` 和 `isVisible`。
- 图标仅在来源和权利确认后通过媒体记录引用；第一版不为未确认图标预留强制依赖。

#### `project`

- 名称、个人角色、四位年份、摘要、详细介绍、亮点列表、`order` 和 `isVisible`。
- 第一版不包含 slug、详情页 SEO、项目图片、视频、Demo 或外部项目链接。
- Project 展开方式完全由 Phase 6 的 Next.js 设计决定。

#### `testimonial`

- 推荐人姓名、职位、公司、与站点所有者的关系、推荐原文、可选日期、可选头像、授权状态、非敏感授权备注、`order` 和 `isVisible`。
- 只有已发布、`isVisible = true` 且授权状态为 `granted` 的记录可以进入网站查询。
- 没有合格记录时，整个区块由 Next.js 隐藏。
- 授权截图、邮件或其他可能包含私人信息的原始证据不存入公开 dataset；由站点所有者在 Sanity 之外私密保存。

#### `socialLink`

- 平台、显示标签、目标地址、无障碍标签、`order` 和 `isVisible`。
- 网站链接必须使用 HTTPS；邮箱使用合法 `mailto:` 地址。当前 schema 不保存私人电话。
- 第一版支持已批准的 Email、GitHub 和 LinkedIn；不重新引入已取消的 X/Twitter。

#### `mediaRecord`

- 原始图片、内部标签、alt、可选 caption、来源、权利状态、可选署名、用途、原始尺寸、目标比例和可选焦点。
- `unknown` 或 `restricted` 权利状态不得作为已发布网站内容使用。
- 授权型或许可型媒体必须保存相应依据或署名信息。

### 排序与发布

- 可排序文档使用非负整数 `order`。
- 同一内容类型的可见记录不得具有重复 `order`；查询结果按 `order` 升序。
- Sanity Draft/Publish 决定记录是否公开，`isVisible` 决定已发布记录是否进入网站。
- `isVisible` 不是草稿替代品，也不授予发布权。

## Studio 编辑体验

继续使用仓库中的 `studio/` 应用，不建立第二套 Studio。Project ID 和 dataset 通过环境变量选择，正式编辑连接 `production`，隔离检查可显式连接 `poc`。

Studio 使用中文导航、字段标题、说明、缺失提示和验证错误；内部 schema 名称和字段名保持稳定英文。导航按“全局设置、个人资料、首页、经历与教育、能力、项目、Testimonials、社交链接、媒体”分组。单例只显示固定入口；列表文档显示中文预览、顺序、时间和可见状态。

验证在编辑时尽早暴露问题，但网站查询层仍执行独立运行时验证，不能把 Studio 验证视为唯一安全边界。

## 网站查询与验证层

查询层按内容域拆分：

- 站点与 SEO
- 身份与教育
- 首页
- Experience
- 能力
- Projects
- Testimonials
- 社交链接
- 媒体

每个内容域包含：类型、GROQ 查询、运行时验证和从 Sanity 结果到页面接口的转换。React 组件不直接处理 Sanity 引用、GROQ 字段名或草稿状态。

Phase 4–7 逐域接入。只有对应正式内容已经录入、发布并通过验证后，页面消费者才切换到 Sanity。Phase 3F 完成时，网站默认仍读取仓库内容，所以现有页面输出不变。

不新增第三方运行时验证依赖。使用聚焦、可单元测试的 TypeScript 验证器，避免仅为 schema 校验扩大生产依赖面。

## 严格失败与人工回滚

已切换内容域发生下列任一情况时，构建失败：

- Sanity 网络或 API 请求失败。
- 必需单例或字段缺失。
- URL 不是有效 HTTPS URL。
- 排序值缺失、不是整数或重复。
- 返回草稿 ID。
- 媒体权利不合格或必要权利元数据缺失。
- Testimonial 未取得公开授权。
- 查询结果不符合稳定页面接口。

禁止自动捕获这些错误后混入旧仓库内容。回滚必须是显式操作：恢复已记录的仓库内容源配置或提交，并重新执行完整构建。最后一次成功部署在 Sanity 故障时保持可用；失败的新构建不得替换它。

## Experience 与 Project 重设计边界

正式 Dataset 的创建不依赖 Experience 或 Project 的视觉重设计。Phase 3F 只建立已知内容事实的 schema。

Experience 的真实内容接入前，在对应首页阶段完成基于真实长文案的桌面与移动设计批准。Project 在 Phase 6 完成原地展开设计批准，尤其明确桌面端采用卡片内展开还是整行下方面板。两者都必须执行“现有框架审计 → 真实内容状态规格 → 实现前批准 → 实现 → 实现后验收”。

若后续设计证明需要当前内容事实无法提供的新字段，必须提交小型、可解释的 schema 增量；不得在 Phase 3F 预先猜测图片、视频、标签或布局配置。

## 验证策略

1. 使用覆盖所有正式类型的本地 fixture 测试 schema、查询、转换和验证。
2. 覆盖必填字段、HTTPS URL、排序唯一性、草稿排除、媒体权利和 Testimonial 授权。
3. 使用 `poc` dataset 做公开读取和草稿隔离的只读连通性检查，不写入 `production` 测试内容。
4. 确认 `production` 不包含 PoC 或参考人物内容。
5. 验证网站默认内容源仍为仓库，构建结果与现有页面结构不变。
6. 执行 Studio 测试、查询层测试、`npm run lint -- --max-warnings=0`、`npm audit --audit-level=low` 和 `npm run build`。
7. 扫描仓库和构建产物，确认没有读取/写入 Token、预览 Token 或 webhook secret。
8. 记录 dataset 清单、依赖版本、故障行为、验证结果和恢复步骤。

## 导出、维护与运维

- 保留 schema、查询、验证和 Studio 配置于 Git。
- 记录 `poc` 与 `production` 的 dataset 清单和导出命令。
- `production` 开始录入正式内容后，将完整 dataset 与原始媒体导出到仓库之外、由所有者选择的私密持久位置。
- 不把含个人资料或大体积媒体的导出提交到 Git。
- 记录 Sanity Free 计划当前适用的限制，不依赖试用期专属能力作为基础要求。
- 依赖升级必须单独审查 Studio 与 Next.js 构建兼容性。
- Phase 11 才创建 Vercel Preview 和真实签名 webhook，并验证发布触发的完整静态重建。

## 云端变更边界

Phase 3F 仅授权在现有 Sanity 项目中创建公开的 `production` dataset。未经新的明确批准，不执行下列操作：

- 创建或部署 Vercel 项目。
- 创建托管 webhook、访问 Token 或 webhook secret。
- 上传 PoC、参考人物或完整正式内容到 `production`。
- 修改付费计划或添加支付方式。
- 合并 `cms_build` 到 `personal-development` 或 `main`。

## 交付物

- 已版本化的正式 Sanity schema 和中文 Studio 信息架构。
- 环境驱动的 `production`/`poc` dataset 配置。
- 类型化、分域、严格验证的 Next.js 查询层。
- 完整本地 fixture 和安全/失败测试。
- Phase 3F 验证与运维记录。
- 保持不变的仓库默认内容源和明确人工回滚说明。

## 完成条件

Phase 3F 只有在以下条件全部满足后才可提交站点所有者验收：

- 最终 schema 与生产集成设计已获批准并实现。
- `production` dataset 已创建、公开读取且不含测试或参考人物内容。
- 草稿隔离、公开读取、严格失败、媒体权利和 Testimonial 授权规则通过验证。
- 网站可通过测试客户端加载完整、有效的已发布内容结构，且不暴露草稿或写权限。
- 网站默认页面内容与交互没有变化。
- Studio 测试、查询层测试、严格 lint、低等级 audit 和生产构建通过。
- 运维、导出、依赖、Free 计划和 Phase 11 webhook 边界已记录。
- 站点所有者完成实现后验收；Phase 4 不会自动开始。

正式头像、分享图、正式域名和真实 Testimonials 仍可保持明确缺失，并分别在后续内容阶段解决；不得以参考站资产或虚构内容填补。
