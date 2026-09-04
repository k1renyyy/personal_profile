# Phase 3B：CMS 与 no-CMS 方案调研

> 调研日期：2026-08-30（America/New_York）
> 适用基线：Next.js 16、React 19、App Router、`output: "export"`、Vercel（可能为 Hobby）
> 事实基准：[`content-consumer-audit.md`](./content-consumer-audit.md)
> 本文只形成决策建议；未注册账号、安装软件、创建云资源或执行 PoC。

## 0. 选型决定更新（2026-08-30）

原报告把“当前唯一编辑者能够通过 Git/TypeScript 独立维护内容”作为关键前提，因而建议 no-CMS。后续需求访谈确认该前提不成立：网站所有者不希望每次修改内容都依赖开发者、IDE 或代理协助，需要通过可理解的后台表单自主维护并发布内容。这个需求不是未来触发条件，而是第一版内容系统的硬性要求。

基于原报告已经收集的第一方证据和新确认的编辑需求，Phase 3B 的最终决定调整为：

- 采用 **Sanity** 作为唯一进入 Phase 3E PoC 的 CMS 候选；
- Sanity 只管理内容，不管理 DOM、布局、样式、动画或页面区块顺序；
- 保留 `output: "export"` 时，发布通过 Sanity webhook 触发 Vercel 完整重建，不使用 Draft Mode、ISR 或运行时内容请求；
- Phase 3E 必须验证后台易用性、草稿隔离、发布重建、最后一次成功部署保留、内容与原媒体导出；
- Payload 不进入本轮 PoC，因为自托管数据库、对象存储、备份和安全升级不符合个人站的维护目标；
- 下文原始评分和 no-CMS 结论保留为决策过程记录；与本节冲突时，以本节及已批准的 Phase 3C 内容模型为准。

## 1. 原始执行摘要（已被第 0 节取代）

**结论：当前保留 TypeScript 类型化仓库内容 + Git，不进行 CMS PoC。**

这不是“暂时选不出来”，而是当前确认需求下的明确选择。网站内容规模小、更新频率尚未证明很高，编辑者目前是开发者；多人协作、审批流、定时发布、多语言、跨渠道复用和脱离代码的独立发布均未成为已确认需求。no-CMS 唯一通过全部硬门槛，并以 **91/100** 排名第一。它天然保持最后一次成功部署、没有 Draft API 泄露面、没有第三方运行时依赖、内容与表现边界清楚、数据和媒体可完整退出。

若未来达到本文第 15 节的量化触发条件，再重新评估。届时优先复核 **Sanity** 与 **Payload**，但它们现在不是获准进入 Phase 3E 的 PoC 候选：Sanity 的完整 Schema/历史/配置退出和套餐能力仍有缺口；Payload 则要求数据库、对象存储、备份、监控和安全升级，明显超过当前个人站需求。

关键架构结论：Next.js 官方说明静态导出不支持依赖请求的 Route Handlers、Draft Mode、ISR 等服务端能力。因此“CMS 发布后安全 webhook + 定向 revalidation + Draft Mode”若成为硬需求，就必须停止纯 `output: "export"`，改用具有 Functions/ISR 的 Next.js 部署；否则只能由 webhook 触发一次完整构建。该约束来自当前交付模式，不是某家 CMS 能消除的限制。[Next.js static exports](https://nextjs.org/docs/app/guides/static-exports) [Draft Mode](https://nextjs.org/docs/app/guides/draft-mode) [ISR](https://nextjs.org/docs/app/guides/incremental-static-regeneration)

## 2. 原始项目需求与决策边界（已由第 0 节更新）

最终确认需要管理的真实内容包括：全站设置/SEO、个人资料与学历、多长度简介、导航、社交链接、技术能力、工作经历、六字段项目经历、testimonials 及其授权状态，以及普通内容图片。Achievements、项目图片、项目链接、项目详情页和逐项目 SEO 已从第一版移除。图片需带 alt、来源、权利、尺寸、比例、焦点、裁切和用途。

组件继续唯一控制 DOM、Tailwind、断点、GSAP/Motion/Anime/Lenis、Shoot Mode、音频、WebGL、section id、动画 hook、工作经历文字布局、项目卡片三列与展开行为、Testimonials 循环数学和图片渲染策略。任何以“page builder”方式把这些职责迁入 CMS 的方案均不适配。

原始调研曾假设开发者通过 Git/PR 更新低量结构化内容和媒体。后续访谈已确认网站所有者需要脱离代码自主编辑，因此“非开发者独立编辑与发布”现为第一版硬性需求；多人并发编辑、审批流、定时发布、多语言、高频发布、大型 DAM 和跨渠道复用仍不是当前需求。

## 3. 调研方法、日期与证据等级

- 访问日均为 2026-08-30；价格和限制以当日官方页面为准，页面标明版本/更新日时在来源索引记录。
- A 级：官方产品/框架文档、定价/限制、官方 GitHub 仓库与 license；B 级：官方教程、FAQ、状态/安全页；C 级：由 A/B 事实推导的本项目判断；U：公开资料未确认。
- 搜索摘要只用于定位页面；评分只采用打开后的第一方资料。没有把“有 Next.js 教程”当作 Next.js 16/React 19 全面兼容证据。
- 未注册账号，故移动端中文编辑、冲突合并、完整导入恢复、Preview 鉴权细节等只能标记为 PoC/厂商确认项。
- 官方资料经常按套餐动态更新；实施前必须重新核价。

## 4. 硬性门槛

| 编号 | 门槛 | 通过定义 |
|---|---|---|
| G1 | 覆盖审计字段 | 有结构化对象/数组/引用/唯一与自定义校验；不接管表现层 |
| G2 | Draft 与 Secret 安全 | 公开读取不能取得 draft；preview 需服务端鉴权；密钥可 server-only |
| G3 | 可靠发布触发 | webhook 有可验证签名和重放控制，或以受保护 Git PR/CI 等效替代 |
| G4 | 已发布站抗故障 | CMS/编辑器中断不使最后一次成功发布下线 |
| G5 | 完整退出 | 核心内容、Schema/类型、关系、富文本原结构、原始媒体及关键元数据可取回 |
| G6 | 当前部署可行 | 可在静态导出 + 构建期读取下工作；若需运行时能力必须明确改架构和成本 |
| G7 | 可接受三年成本 | 包括订阅、托管、数据库、存储、备份、监控、升级与人力 |
| G8 | 商业/许可可接受 | 不因作品集求职/商业展示语境违反免费条款；开源许可允许使用 |

G3 中“共享静态 secret 放在 URL/header”不等于签名和防重放。可接受的等效方案须由 Git provider 的 OAuth/branch protection/PR/CI 权限边界提供，或接收端验证 HMAC、时间戳并做幂等处理。

## 5. 候选长名单与门槛结果

| 方案 | 类型 | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | 结果 |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| typed repository + Git | no-CMS | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 通过 |
| Sanity | SaaS | ✓ | ✓ | ✓ | ✓ | △ | ✓ | ✓ | ✓ | 暂不通过：完整退出待证 |
| Payload | self-host/hybrid | ✓ | ✓ | 自建 | ✓ | ✓ | △ | △ | ✓ | 暂不通过：运维/TCO 过度 |
| Storyblok | SaaS | ✓ | ✓ | △ | ✓ | △ | ✓ | △ | ✓ | 不通过：免费档签名与完整退出 |
| Contentful | SaaS | ✓ | ✓ | △ | ✓ | △ | ✓ | ✗ | ✗ | 淘汰：Free 禁商业；Lite $300/月 |
| DatoCMS | SaaS | ✓ | ✓ | △ | ✓ | ✗ | ✓ | △ | ✓ | 淘汰：完整项目导出仅 Enterprise 且仍不完整 |
| Hygraph | SaaS | ✓ | ✓ | △ | ✓ | △ | ✓ | △ | ✓ | 淘汰：退出证据弱、版本留存/安全能力高档化 |
| Prismic | SaaS | △ | ✓ | △ | ✓ | △ | ✓ | ✓ | ✓ | 淘汰：Slice 模型耦合、完整 Schema/媒体退出未证实 |
| Strapi | self-host/hybrid | ✓ | ✓ | 自建 | ✓ | ✓ | △ | △ | ✓ | 淘汰：需常驻服务且默认 webhook 不是平台签名 |
| Directus | self-host/hybrid | ✓ | ✓ | 自建 | ✓ | ✓ | △ | △ | △ | 淘汰：许可/收入阈值与全栈运维责任 |
| Decap CMS | Git-based | △ | ✓ | Git 等效 | ✓ | ✓ | ✓ | ✓ | ✓ | 淘汰：新增 OAuth/admin 客户端且模型校验较弱 |

“△”不是完整支持；表示理论可做、自定义实现、付费后可用或仍需验证。未过硬门槛者不因总分进入 PoC。

## 6. 未加权事实矩阵

| 方案 | Next/App/RSC 证据 | 静态生成 | Draft/Preview | 模型/校验 | Webhook 安全 | 退出 | 常驻服务 | 客户端影响 |
|---|---|---|---|---|---|---|---|---|
| Git | 框架原生 | 原生 | PR Preview | TS；建议 3C 加构建期 schema 校验 | Git/CI 权限，无 CMS webhook | Git clone 即完整 | 无 | 无 |
| Sanity | 官方 Next.js App Router 文档；未明确承诺 16/React 19 | 构建期查询可行 | draft dataset/Visual Editing；需服务端 token | code-first schema、GROQ、数组/引用/validation | 官方 `parseBody` 验证签名；时间戳防重放未见公开保证 | dataset export 可用；用户/角色/webhook/完整历史未证实 | SaaS 无 | 仅 server client 可做到零浏览器 SDK；视觉编辑会增加客户端代码 |
| Storyblok | 官方 `@storyblok/react/rsc` App Router 指南；版本承诺未确认 | Delivery API 可构建读取 | Visual Editor/preview | component schema、字段类型和角色 | secret/signature 仅付费；重放机制未确认 | story JSON 可导出；完整 space schema/版本/原媒体一键退出未确认 | SaaS 无 | RSC SDK可用；Bridge/视觉编辑需客户端 |
| Contentful | 官方 App Router Draft handler | CDA 构建读取 | Preview API/Draft Mode | content types、validation、references | 可配 secret header；原生签名+时间戳证据不足 | CLI export/import；历史、全部配置和原媒体语义需复核 | SaaS 无 | server-only 可行 |
| DatoCMS | 官方 Next.js/Draft Mode 指南 | CDA/GraphQL 构建读取 | Draft Mode/Visual Editing | models、validators、structured text | Basic/custom header；原生 HMAC/防重放未确认 | Enterprise project export 包内容/资产，但排除 revisions、tokens、webhooks、roles 等 | SaaS 无 | server-only 可行；视觉编辑另增客户端 |
| Hygraph | 官方 Next.js/live preview 教程；16/19 未明确 | GraphQL 构建读取 | stages/live preview | GraphQL schema、components、validations | webhooks 可配 secret header；HMAC/重放证据不足 | 内容可 API 拉取；官方 FAQ 仅称联系迁移，完整可逆性未证实 | SaaS 无 | server-only 可行 |
| Prismic | 官方 Next.js App Router 文档 | Content API 构建读取 | previews | custom types/Slices；显示块倾向耦合 | webhook secret；HMAC/时间戳证据不足 | migration/API 可取内容；完整 schema/history/media bundle 未证实 | SaaS 无 | server-only 可行；Toolbar/preview 增客户端 |
| Payload | 与 Next.js 同进程/独立部署均有官方文档；版本组合需 PoC | local/API 构建读取 | drafts/versions/preview | TypeScript code-first、hooks/access control | hooks 自建 HMAC/时间戳/幂等 | DB + code schema + object storage 可完全掌控；import/export plugin 能力需实测 | 是：Node + DB + storage | 可纯 server；admin 为独立客户端 |
| Strapi | 通用 REST/GraphQL；官方 Next 内容多为教程 | API 构建读取 | Draft & Publish | content types/components/dynamic zones | 官方建议自行 HMAC+时间戳；发送端实现责任在我们 | export/transfer；媒体与 provider/DB 恢复需实测 | 是：Node + DB + storage | 可纯 server |
| Directus | 通用 REST/GraphQL/SDK | API 构建读取 | status/roles/preview URL | DB-first fields/relations/validation | Flows/webhooks；签名与重放需自建 | schema snapshot + DB/files；跨版本/DB 有限制 | 是：Node + DB + storage | 可不用客户端 SDK |
| Decap | 官方 Next.js 指南 | 文件构建读取 | editorial workflow + deploy preview | YAML widgets/collections；复杂跨记录校验弱 | GitHub OAuth/PR；无需内容 webhook | 仓库即内容/schema/media | OAuth proxy 可需服务 | `/admin` 加载 CMS JS；公开页面可零影响 |

所有 hosted 方案都可在**构建期**由 server-only 凭证读取 published 内容；但若把 token 写入 `NEXT_PUBLIC_*`、Client Component 或浏览器预览 SDK，仍会泄露。这是集成责任，不是平台自动保证。

## 7. Next.js 16 与部署兼容性

1. `generateStaticParams`、`generateMetadata` 和 Server Components 可在构建期读取任一 HTTP/GraphQL/本地内容源。每个候选都“理论可用”，不代表其 SDK 已明确验证 Next.js 16 + React 19。
2. `output: "export"` 生成静态文件；请求时需要服务器的功能不受支持。Draft Mode、ISR、依赖请求的 Route Handler 和按需 `revalidatePath`/`revalidateTag` 不能在纯导出站内工作。[Static exports](https://nextjs.org/docs/app/guides/static-exports)
3. 保持纯导出时，CMS publish 只能安全触发 Vercel/Git provider 新构建；成功构建原子替换旧部署。CMS 中断只影响新构建/编辑，不影响旧站。构建脚本须在 fetch/validation 失败时 fail closed，不能发布空内容。
4. 若未来需要 Draft Mode 和定向 revalidation，应移除 `output: "export"`，使用 Vercel Functions/ISR；这引入运行时、配额、缓存一致性和 webhook endpoint。Next.js 支持 tag/path revalidation，但其存在不表示 CMS webhook 已安全。[revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath) [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
5. Vercel Hobby 官方限定 non-commercial personal use；作品集若用于求职获利或商业展示，适用性需 Vercel 书面确认或改 Pro。此风险独立于 CMS。[Hobby](https://vercel.com/docs/plans/hobby) [Fair use](https://vercel.com/docs/limits/fair-use-guidelines)
6. 远程 CMS 图片在静态导出中若使用 Next Image 默认优化存在限制；可在构建时下载/自托管，或明确 remote loader/unoptimized 策略。最佳抗故障路径是将发布媒体快照纳入构建产物，而非浏览时依赖 CMS URL。

## 8. 内容模型适配

所有完整 headless CMS 均能表达基础字符串、对象、数组、图片和引用；差异集中在**跨记录约束、确定排序和不把展示逻辑塞进 Schema**。

- `siteSettings`、`identity`、contact/social singleton：Sanity/Payload 的 code-first schema 最清楚；其他 SaaS 可用 singleton/固定 document 模拟；Git 直接由唯一模块表达。
- project：第一版只向所有者展示名称、个人角色、年份、摘要、详细介绍和亮点列表六个内容字段；系统另存稳定排序与发布状态。项目不使用 slug、技术标签、图片、GitHub、在线链接或逐项目 SEO，也不生成详情页。
- media：CMS asset 自带尺寸/焦点不等于拥有 `source`、`rightsStatus`、`attribution`、`intendedPlacements`；所有方案都需显式自定义这些字段。原始媒体与裁切参数必须一同导出。
- structured text：只允许受控节点映射到 React 组件；禁任意 HTML、script、class、iframe。Sanity Portable Text、Dato Structured Text、Contentful Rich Text、Storyblok Richtext、Prismic Rich Text、Hygraph Rich Text 都是供应商 AST，迁出时需转换器。
- 技术图标、animation selector、项目卡片布局与移动/桌面视图投影继续留在源码。Storyblok/Prismic 的 page/slice builder 默认心智模型最容易越界，虽可通过只建内容型 schema 规避。
- Git + TypeScript 对编译类型强，但 TypeScript 不能单独验证运行时/导入数据；Phase 3C 应定义平台中立类型和构建期 schema validator（可考虑 Zod，届时另行批准依赖），再校验唯一性、引用、长度、URL、数量与授权状态。

## 9. 安全、Draft、Preview 与 Webhook

| 风险面 | 最低控制 | 事实判断 |
|---|---|---|
| published/draft | 两个查询路径/权限；公开 token 只能 published | SaaS 普遍有 published/preview API 或 stage；self-hosted 必须配置 row/collection access；Git 用未合并分支隔离 |
| Preview | 随机 secret 不够；需登录/短时授权、路径 allowlist、server-only draft token | 纯 export 无 Draft Mode；PR Preview 是当前最简单的隔离模型 |
| webhook 伪造 | 验证 raw body HMAC、恒时比较 | Sanity 有明确签名解析；Storyblok secret/signature 为付费能力；多家只提供 custom secret header |
| webhook 重放 | 签名覆盖 timestamp、过期窗口、event id 幂等 | 除自建 Strapi 指南外，多数公开页未证明平台原生完整提供，标 U/PoC |
| token | delivery/preview/write 分离、最小 scope、rotation | 平台通常可分 delivery/management；精细 scope 常与套餐/角色相关，实施时逐 token 验证 |
| public assets | 假设 URL 可公开访问 | 不把未授权 testimonial/media 上传；删除后还需验证 CDN purge |

Sanity 官方要求 Next.js webhook 始终验证签名。[Sanity webhook validation](https://www.sanity.io/docs/nextjs/validating-sanity-webhooks-nextjs) Storyblok 明确 webhook secret/signature 在付费计划。[Storyblok webhooks](https://www.storyblok.com/docs/concepts/webhooks) Strapi 官方文档实际上把 HMAC、timestamp 与防重放列为需要实现的建议，并非默认发送端保证。[Strapi webhooks](https://docs.strapi.io/cms/backend-customization/webhooks)

安全公告不能以“搜索不到”推导“没有漏洞”。Self-hosted 必须订阅 release/security advisory，及时升级 Node、CMS、数据库、adapter、admin UI 和 storage provider；SaaS 的平台补丁由厂商负责，但 access policy、token、preview endpoint、webhook receiver 和内容授权仍由本项目负责。

## 10. 可靠性、缓存与故障模式

- **Git/no-CMS：** GitHub 或 Vercel 中断不影响现有静态部署；只阻塞编辑/构建。Git clone 是离线备份，PR/commit 是恢复点。
- **Hosted：** 使用构建期 published snapshot 时，CMS/CDN 中断不影响现有站，但会使新构建失败；运行时请求则会把中断传给访客。不得以空数组兜底覆盖旧站。
- **Self-hosted：** 生产站仍可静态抗故障，但编辑、preview 和新构建依赖 CMS、DB、object storage。我们承担备份可恢复性、schema migration、容量、日志、告警、补丁和密钥轮换。
- **Webhook：** 所有方案都必须按至少一次投递设计：验证、幂等、合并短时间突发、记录 event id、失败重试/人工重建；乱序事件只触发“读取当前 published snapshot”，不能盲信 payload 状态。
- **API 限流：** 构建时批量/分页、缓存并限制并发。Hygraph Hobby 未缓存请求为 5 RPS 且超限阻塞；其他免费档也常为 hard cap。规模虽小，风险低但应测试。[Hygraph billing limits](https://hygraph.com/docs/getting-started/update-billing)
- **SLA：** 免费档通常无 SLA。Storyblok Growth 仅列 97%；Strapi Cloud Business 才 99.9%；Hygraph SLA 为 Enterprise。现有静态部署令 CMS SLA 对访客可用性的重要性显著降低。
- **状态与事故：** Sanity、Contentful、DatoCMS 提供可查历史的官方状态页；例如 Contentful 2026-08 的历史包含 audit-log 与 add-on 事件，DatoCMS 说明维护期可能只读而缓存 CDA 继续服务。状态页证明可观察性，不证明未来可用性，也不能替代付费 SLA。其余候选的完整历史、恢复时间和多区域承诺未逐项得到同等级公开证据，按 U 处理。[Sanity status](https://status.sanity.io/) [Contentful status](https://contentful.statuspage.io/) [DatoCMS status](https://status.datocms.com/)

## 11. 当前定价、限制与三年 TCO

价格均为 2026-08-30 页面显示的标价，不含税；“0”只表示订阅，不表示运维时间为零。

| 方案 | 当前官方要点 | 最低合理现金成本/3年 | 主要增长悬崖 |
|---|---|---:|---|
| Git | Git/现有仓库；无 CMS 订阅 | $0 增量 | 非开发编辑时间 |
| Sanity | Free：20 seats，Admin/Viewer；配额见动态 pricing；Growth $15/seat/月 | $0；2 编辑若需细角色约 $1,080 | 角色、用量与 add-on |
| Storyblok | Free：1 seat、100k API/月、100GB traffic、2 locales、3 webhooks；第二 seat $15/月；Growth $99/月 | 1 人 $0；2 人 $540；若要 signed secret 至少约 $3,564 | 签名 webhook/版本留存推到付费 |
| Contentful | Free 10 users/100k calls/50GB，但官方限制 test/learn，禁止 commercial；Lite $300/月 | 商业语境约 $10,800 | 从 free 直跳 $300/月 |
| DatoCMS | Free 2 editors/300 records/100k calls/10GB；Professional 价格以动态配置为准 | 当前规模 $0；完整 export 需 Enterprise 报价 | 300 records、hard stop、Enterprise export |
| Hygraph | Hobby 3 seats/1k entries/500k calls/100GB/5 RPS；Growth $199/月 | $0；需版本/高阶能力约 $7,164 | 版本、权限、恢复到 Growth/Enterprise |
| Prismic | Free $0；Starter $10；Small $25；按 repository | $0–$900 | 高阶角色/发布能力随档位 |
| Payload | MIT self-host；Node + DB + object storage | 现金可落在免费额度；按 2–5 小时/月运维计 72–180 小时 | 运维事故/数据库/存储/升级 |
| Strapi | self-host 软件可免费；Cloud Starter $35/月、Pro $90、Business $450 | Cloud $1,260 起；Pro $3,240 | backups 到 Pro；SLA 到 Business |
| Directus | BSL 1.1；低于官方总财务阈值可免费 self-host，超阈值需 license；Cloud 动态报价 | 免费基础设施额度 + 72–180 运维小时，或报价 | 许可资格、托管与运维 |
| Decap | 开源；内容和媒体进 Git；OAuth proxy/identity 可能有托管成本 | $0 现金 + 约 18–54 小时维护 | OAuth、Git API、媒体仓库膨胀 |

官方价格证据：[Sanity](https://www.sanity.io/pricing) [Storyblok](https://www.storyblok.com/pricing) [Contentful](https://www.contentful.com/pricing/) [Contentful usage/commercial restriction](https://www.contentful.com/help/admin/usage/usage-limit/) [DatoCMS](https://www.datocms.com/pricing) [Hygraph](https://hygraph.com/pricing) [Prismic](https://prismic.io/pricing) [Strapi Cloud](https://strapi.io/pricing-cloud) [Payload self-host](https://payloadcms.com/get-started) [Directus license](https://directus.io/bsl) [Decap](https://decapcms.org/)

### 三种情景

| 情景 | 规模假设 | Git | Hosted 免费档 | Self-hosted |
|---|---|---|---|---|
| S1 当前 | 约 7 projects、十余图片、1 编辑、低频 | $0；最小维护 | 多数 $0，但 Contentful 商业限制、Storyblok 签名缺口等令“免费”不等于合格 | 资源或可免费，运维远高于收益 |
| S2 5× | 约 35 projects、65+ media，构建请求仍低 | $0；仓库增大但可控 | 多数容量仍够；Dato 300 records 需严密计数，限流/traffic 需监测 | DB/storage 仍小，升级/备份责任不变 |
| S3 2 编辑/3年 | 低频持续维护 | $0；GitHub 协作者 + PR | Sanity 可 $0 但角色有限；Storyblok 第二 seat $540；Contentful 合格付费约 $10,800；其他按上表 | 现金可能低，72–180 小时运维；按任意专业工时计价都会超过小站 SaaS 收益 |

Vercel 成本需单列：若网站被认定为 commercial，Hobby 不可用，需当时的 Pro 定价；若为 Draft/ISR 移除纯 export，也要计 Functions/ISR/构建用量。本文不把未经任务确认的时薪伪装成精确美元 TCO，因此以维护小时透明表达。

## 12. 数据导出、备份与退出路径

| 方案 | 内容/关系 | Schema | Draft/历史 | 原媒体/元数据 | 配置/用户 | 回到 typed repo |
|---|---|---|---|---|---|---|
| Git | 完整 | TS/schema 文件完整 | branch/commit 完整 | 完整 | Git provider 配置另备份 | 已是目标格式 |
| Sanity | dataset export | code schema 可在 Git；平台配置另算 | draft 可导；完整历史未确认 | assets 可随 export；crop/hotspot 在记录 | 角色/webhook未确认 | 中等：转换 GROQ/Portable Text |
| Storyblok | per-story/API | component schema API需脚本 | retention 按套餐；完整历史未证实 | asset API/下载需脚本 | roles/webhooks需脚本 | 中高：blok/richtext 转换 |
| Contentful | CLI export/import | content types 可导 | snapshots/history 完整性未证实 | assets metadata/二进制需验证 | roles/webhooks不保证完整 | 中高：Rich Text/links/locales |
| DatoCMS | Enterprise snapshot | JSON 部分 | 明确排除 revision history | 包 uploaded assets | 明确排除 token/webhook/collaborator/role/audit | 中高且付费门槛高 |
| Hygraph | API 拉取 | GraphQL introspection 不等于管理 schema | version export 未证实 | 需枚举下载 | 未证实 | 高 |
| Prismic | API/migration 工具 | custom type 文件部分可在 Git | 完整历史未证实 | media library 批量原件未证实 | 未证实 | 中高：Slice/Rich Text |
| Payload | DB/插件 | TS config 在 Git | DB 中可备份 | storage bucket 可复制 | env/用户 DB | 低中：自有数据结构 |
| Strapi | data export/transfer | schema 文件 + DB | 按版本/DB | provider files 需同备份 | config/env另备份 | 中 |
| Directus | DB + utils | schema snapshot | DB/audit按配置 | storage adapter files | flows/roles随系统表，需实测恢复 | 中 |
| Decap | Git 完整 | `config.yml` | Git branch/history | repo files完整 | OAuth app设置另记 | 低 |

DatoCMS 官方明确 Enterprise Project Export 不包含 revision history、API tokens、webhooks、collaborators、roles、permissions、audit logs，且不是一键恢复。[DatoCMS export](https://www.datocms.com/docs/import-and-export/datocms-site-export-feature) Directus schema snapshot 跨版本/数据库默认拒绝应用。[Directus schema](https://docs.directus.io/reference/system/schema) Strapi 提供 export/transfer，但生产恢复还需数据库与 media provider 联合演练。[Strapi export](https://docs.strapi.io/cms/data-management/export)

任何 SaaS 若进入未来 PoC，退出测试必须在试用期内：导出两条 project、关系、draft/published 状态、富文本 AST、原始图片及全部权利/裁切字段；在无 CMS 网络访问下转换成 repository module 并成功构建。仅能 GET published JSON 不算完整退出。

## 13. 编辑体验与运维责任

- Storyblok 的 Visual Editor、Prismic Slices、Dato/Sanity visual editing 对非开发者直观，但本项目不允许编辑者控制布局；视觉能力的边际价值较小，集成 bridge/overlay 反而增加客户端代码与预览安全面。
- Sanity Studio 与 Payload admin 的 code-first schema、help text、自定义 validation 最贴合字段模型；Payload 的编辑器体验由我们部署和升级。
- Contentful/Hygraph/Dato/Storyblok 的表单、角色和 workflow 成熟，但必要的版本、角色、scheduled publish、audit/SSO 常在较高档位。
- Decap 在 Git 上提供简单表单和 editorial workflow；其跨文件引用、唯一性、复杂条件/数组上限仍需 CI validator 兜底，合并冲突也落回 Git。
- no-CMS 对开发者最有效：IDE、批量编辑、PR diff、review、rollback 清晰；对非技术编辑门槛最高。原始评估曾假定没有非技术编辑需求；后续确认该假定错误，见第 0 节。

## 14. no-CMS 完整分析

### 设计

继续把 canonical content、媒体与 schema 放在仓库：TypeScript `as const`/类型提供开发期约束；平台中立运行时校验在构建期检查引用、URL、必填、长度、数组上下界、稳定排序、testimonial authorization 和媒体 rights。发布必须经 PR review 和 CI；draft 用 branch/draft PR，preview 用受保护 Vercel Preview；rollback 为 revert。

### 优点

- 内容、schema、媒体、代码同版本；可审阅、可 diff、可回滚、可镜像备份。
- 静态生成无运行时 CMS/API/SDK/token，production bundle 和攻击面最小。
- 不存在第三方 draft API 枚举、webhook 伪造、SaaS 限流、价格悬崖和富文本 AST 锁定。
- 精确保持项目顺序、文本几何与表现边界；批量变更和跨记录校验最容易。

### 缺点与补偿

- 非技术编辑差：当前由开发者维护；未来触发条件出现再选 CMS。
- 图片管理无焦点 UI：使用结构化 media manifest，PR 中检查 dimensions/rights/focal point；原图留 Git/LFS 或批准的对象存储。
- 富文本编辑不直观：本网站当前不需要自由长篇 WYSIWYG；使用受控 blocks/Markdown，React 映射白名单。
- 独立发布、定时发布和多人审批弱：当前不是需求；GitHub PR/branch protection 足够。
- TypeScript 不是全部运行时校验：3C 必须定义构建期 validator；本阶段不安装 Zod 或任何包。

### 重新评估的量化触发条件

满足任一项并持续一个月，或业务已确定将在三个月内满足，即重新启动 CMS 研究：

1. 每月需要 **8 次以上**内容发布，且 PR/部署平均管理时间超过 **30 分钟/次**；
2. 出现 **1 位以上非开发者**需直接编辑，或同时有 **2 位以上编辑者**；
3. 明确需要两级审批、定时发布或不经代码部署的独立发布，每月至少 **2 次**；
4. 需要 **2 个以上 locale** 或同一内容复用到 **2 个以上渠道**；
5. 管理媒体超过 **500 项或 5 GB**，需要 DAM 搜索/版权到期/动态裁切；
6. 内容冲突/回滚错误每季度 **2 次以上**，或内容维护成为已记录的交付瓶颈。

## 15. 风险登记表与根因

概率/影响使用 L/M/H；可检测性“低”表示较难及时发现。

| 方案 | 风险/根因/归属 | 条件 | 概率/影响/检测 | 缓解与剩余风险 | PoC | 淘汰 |
|---|---|---|---|---|---:|---:|
| Git | 非开发者无法高效编辑；需求尚未出现（需求） | 编辑角色变化 | M/M/高 | 触发阈值后重评；当前低 | 否 | 否 |
| Git | TS 不能覆盖运行时数据完整性（实现） | 手工绕过类型 | M/H/高 | build validator + CI；剩余低 | 否 | 否 |
| Sanity | SDK示例不等于 Next16/React19承诺（平台/集成） | 升级框架/SDK | M/M/高 | 固定版本做 build/preview；剩余中 | 是 | 当前否 |
| Sanity | dataset export 不等于全部 schema/history/config（平台） | 退出/账号关闭 | M/H/低 | 定期 export + schema进Git +恢复演练；缺口仍中 | 是 | 当前门槛 |
| Storyblok | 免费档 webhook secret/signature 不可用（平台/套餐） | publish触发构建 | H/H/高 | 付费 Growth 或 Git触发；引入$99/月 | 是 | 是 |
| Storyblok | blok/page builder 侵入表现层（集成） | 编辑器建布局 | M/H/高 | 只暴露内容 schema；剩余中 | 是 | 是 |
| Contentful | Free 禁 commercial；合格层 $300/月（平台/条款） | 求职/获利语境 | H/H/高 | 付 Lite/取书面确认；TCO不可接受 | 否 | 是 |
| Contentful | export 不保证全部历史/配置/媒体恢复（平台） | 退出 | M/H/低 | CLI演练与媒体镜像；剩余中 | 是 | 是 |
| DatoCMS | 完整项目 export 仅 Enterprise 且明确排除关键对象（平台） | 备份/退出 | H/H/高 | API自建导出仍不能恢复历史 | 否 | 是 |
| DatoCMS | Free 达硬限后服务停止正常响应（平台） | records/API/traffic超限 | L/H/高 | 监控/升级；旧静态站仍在 | 是 | 是 |
| Hygraph | reversibility 公开说明仅建议联系厂商（平台） | 退出 | M/H/低 | 自建API dump/媒体镜像；完整性未知 | 是 | 是 |
| Hygraph | Hobby 5 RPS、无版本留存（平台/套餐） | 构建并发/误编辑 | M/M/高 | 限流、Git snapshot；价值被削弱 | 是 | 是 |
| Prismic | Slice 模型绑定页面结构（平台/集成） | 使用推荐工作流 | M/H/高 | 禁 Slice layout；则编辑优势下降 | 是 | 是 |
| Prismic | 完整 schema/history/media export 未证实（平台） | 退出 | M/H/低 | 厂商确认 + PoC | 是 | 是 |
| Payload | 常驻服务/DB/storage/backup/patch（运维） | 任何生产使用 | H/H/中 | 托管服务、告警、恢复演练；风险转给我们 | 是 | 是 |
| Payload | 与现有 Next app 同部署扩大故障域（架构） | monolith 部署 | M/H/中 | CMS独立部署；成本上升 | 是 | 是 |
| Strapi | 默认 webhook 仅自定义 header，签名/重放由我们实现（平台/实现） | endpoint公开 | H/H/高 | 自定义 sender HMAC+timestamp；开发/维护成本 | 是 | 是 |
| Strapi | 数据库/媒体/升级恢复失败（运维） | upgrade/事故 | M/H/低 | 备份、restore drill、版本矩阵 | 是 | 是 |
| Directus | BSL 财务阈值/未来主体资格（许可） | 收入/融资变化 | L/H/中 | 周期核查或付 license；剩余中 | 否 | 是 |
| Directus | schema snapshot 跨版本/DB受限（平台/运维） | 迁移恢复 | M/H/中 | 同版本同DB restore drill | 是 | 是 |
| Decap | OAuth proxy/admin JS 扩大攻击面（集成） | 开启 `/admin` | M/H/中 | 独立受保护域、最小 OAuth scope | 是 | 是 |
| Decap | 跨文件校验/冲突弱（平台） | 多编辑/复杂引用 | M/M/高 | CI validator/PR；接近原 Git 流程 | 是 | 是 |
| 全部 CMS | 远程媒体URL失效/删后CDN残留（平台/集成） | 删除/迁移/中断 | M/H/低 | 构建快照、原件镜像、purge测试 | 是 | SaaS门槛 |
| 全部 CMS | 静态导出与 Draft/ISR冲突（当前架构） | 要实时预览/定向刷新 | H/H/高 | 改为server deployment或PR preview | 是 | 当前不采CMS |

## 16. 100 分制评分

评分基于当前需求：项目/Next 架构 20，模型 15，安全 15，可靠性 10，可移植性 15，三年 TCO 10，编辑体验 10，运维 5。“U”按不支持计，付费/自建能力按实际成本扣分。

| 方案 | 架构20 | 模型15 | 安全15 | 可靠10 | 退出15 | TCO10 | 编辑10 | 运维5 | 总分 | 门槛 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| typed repo + Git | 20 | 14 | 15 | 10 | 15 | 10 | 3 | 4 | **91** | 通过 |
| Sanity | 16 | 14 | 13 | 8 | 9 | 8 | 9 | 4 | **81** | 未过G5 |
| Payload | 14 | 15 | 12 | 7 | 14 | 4 | 8 | 1 | **75** | 未过G6/G7 |
| Decap CMS | 17 | 10 | 10 | 9 | 15 | 9 | 6 | 3 | **79** | 未过G1/G3（需自建） |
| Storyblok | 15 | 12 | 8 | 8 | 8 | 5 | 10 | 4 | **70** | 未过G3/G5/G7 |
| Contentful | 15 | 13 | 10 | 8 | 9 | 1 | 9 | 4 | **69** | 未过G3/G5/G7/G8 |
| DatoCMS | 16 | 14 | 9 | 8 | 5 | 6 | 9 | 4 | **71** | 未过G3/G5 |
| Hygraph | 15 | 13 | 9 | 7 | 5 | 6 | 8 | 4 | **67** | 未过G3/G5 |
| Prismic | 15 | 10 | 9 | 8 | 6 | 8 | 8 | 4 | **68** | 未过G1/G3/G5 |
| Strapi | 12 | 13 | 9 | 6 | 13 | 4 | 8 | 1 | **66** | 未过G3/G6/G7 |
| Directus | 12 | 13 | 9 | 6 | 13 | 4 | 8 | 1 | **66** | 未过G3/G6/G7/G8 |

Decap 总分高于 Payload，但门槛未通过，所以不能越级；Sanity/Payload 是未来重评时信息价值最高的两种不同责任模型，而不是本阶段 PoC 推荐。

## 17. 淘汰候选与明确原因

- **Storyblok：** 免费档缺签名 webhook secret；完整 space/schema/history/media 退出未证；视觉页面模型易越过表现边界。
- **Contentful：** Free 明确仅 learn/test 且不支持 commercial；Lite $300/月，与个人站价值不成比例；完整退出仍需验证。
- **DatoCMS：** Enterprise-only export 且明确排除历史、webhook、角色等，直接触发退出门槛。
- **Hygraph：** 完整 reversibility 缺官方自助保证；Hobby 无版本留存、5 RPS，Growth $199/月仍无 custom roles。
- **Prismic：** Slice/page composition 与本项目固定组件边界冲突；完整 schema/history/media bundle 证据不足。
- **Strapi：** 当前无需承担常驻 Node/DB/storage；webhook HMAC/防重放为自建控制；备份恢复和升级责任过高。
- **Directus：** 同类运维负担，加上 BSL 条件核查；schema 跨版本/DB迁移受限。
- **Decap CMS：** 相比直接 Git 只改善表单，却增加 OAuth proxy、公开 admin、客户端依赖和较弱跨记录校验；当前无非技术编辑者，收益不足。
- **Sanity/Payload：** 不作永久淘汰；分别因完整退出证据和 self-host 运维/TCO 未过当前门槛，留作未来触发后复核。

## 18. PoC 候选与计划边界

**原始研究建议进入 Phase 3E 的 CMS 候选为 0 个；该建议已被第 0 节的需求更新取代。最终获准进入 Phase 3E 的候选为 Sanity，候选数为 1。** Phase 3E 仍须等待 Phase 3C 模型批准和 Phase 3D 内容清单建立，并在独立 worktree/branch 中执行。

Sanity PoC 获准启动时，独立 worktree 仅验证：1 site settings、1 profile、2 projects、1 张含 alt/版权元数据图片、鉴权草稿预览、发布触发完整静态重建、CMS 中断保留旧站、内容/schema/原媒体完整导出、回滚到 repository content。Phase 3C 已决定第一版保留 `output: "export"`，因此 PoC 不以 Draft Mode、ISR 或定向 revalidation 作为发布实现。

## 19. 仍未确认的问题

1. 该作品集是否会被 Vercel 认定为 commercial，Hobby 是否合规；需要 Vercel 书面确认或采用 Pro 假设。
2. 未来实际编辑者是谁、预计月发布次数、是否确定需要独立发布/定时发布/多语言；当前均无已确认需求。
3. 多数 SaaS 是否可完整导出 draft、版本历史、角色、webhook、audit、rich-text AST 和原媒体并恢复；公开资料不足。
4. 各官方 SDK 对项目锁定的确切 Next.js 16 + React 19 版本组合；教程不是兼容承诺。
5. Storyblok/Contentful/Dato/Hygraph/Prismic webhook 的原生签名算法、timestamp、防重放和 event-id 保证；部分只证实 secret/header。
6. SaaS 删除资产后的 CDN purge 时限与账号关闭前导出窗口。
7. 中国大陆/中文移动端实际编辑体验、并发冲突表现；需要真实账号 PoC，但当前不构成启动账号的授权。

这些未知项不会撤销当前 Sanity PoC 决定，但必须在 Phase 3E/3F 中验证后才能批准生产集成。

## 20. 当前建议与下一步

1. Phase 3B 已批准 Sanity 为唯一 PoC 候选，依据是网站所有者需要脱离代码自主编辑。
2. Phase 3C 已批准平台中立内容模型；Phase 3D 建立并审核真实内容清单后，才可在独立 worktree/branch 开始 Phase 3E。
3. Phase 3E 验证稳定排序、推荐语授权、受控富文本、原媒体导出、发布重建和 CMS 故障行为。
4. 在生产部署前单独解决 Vercel Hobby commercial-use 判断。
5. 每季度或触发第 14 节任一阈值时重新评估，且重新读取当日价格、限制、license 与 SDK compatibility。

## 21. 官方来源索引

### 框架与部署

- Next.js：[Static Exports](https://nextjs.org/docs/app/guides/static-exports)、[Draft Mode](https://nextjs.org/docs/app/guides/draft-mode)、[ISR](https://nextjs.org/docs/app/guides/incremental-static-regeneration)、[`revalidatePath`](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)、[`revalidateTag`](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)。访问 2026-08-30。
- Vercel：[Hobby Plan](https://vercel.com/docs/plans/hobby)（页面标注更新 2026-01-07）、[Fair Use](https://vercel.com/docs/limits/fair-use-guidelines)（页面标注更新 2025-09-24）。访问 2026-08-30。

### Hosted / SaaS

- Sanity：[pricing](https://www.sanity.io/pricing)、[plans](https://www.sanity.io/docs/platform-management/plans-and-payments)（搜索结果标注更新 2026-08-21）、[Next.js client](https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs)、[caching/revalidation](https://www.sanity.io/docs/nextjs/caching-and-revalidation-in-nextjs)、[webhook validation](https://www.sanity.io/docs/nextjs/validating-sanity-webhooks-nextjs)、[datasets](https://www.sanity.io/docs/content-lake/datasets)、[roles](https://www.sanity.io/docs/content-lake/roles-concepts)。
- Storyblok：[pricing](https://www.storyblok.com/pricing)、[commercial free FAQ](https://www.storyblok.com/faq/am-i-allowed-to-use-storybloks-free-account-for-commercial-websites)、[Next.js/RSC](https://www.storyblok.com/docs/guides/nextjs)、[visual preview](https://www.storyblok.com/docs/guides/nextjs/visual-preview)、[webhooks](https://www.storyblok.com/docs/concepts/webhooks)、[roles](https://www.storyblok.com/docs/concepts/roles)、[story export/import](https://www.storyblok.com/docs/api/management/stories/examples/export-import-json-examples)。
- Contentful：[pricing](https://www.contentful.com/pricing/)、[usage limits](https://www.contentful.com/help/admin/usage/usage-limit/)（版本 2026-08-14）、[App Router Draft Mode](https://www.contentful.com/developers/docs/tools/vercel/vercel-nextjs/setting-up-draft-mode-route-handler/)、[CMA overview](https://contentful.com/developers/docs/references/content-management-api/overview)、[environment access](https://www.contentful.com/developers/docs/tutorials/general/managing-access-to-environments/)、[webhooks](https://www.contentful.com/developers/docs/webhooks/)。
- DatoCMS：[pricing](https://www.datocms.com/pricing)、[Next.js](https://www.datocms.com/docs/next-js)、[Draft Mode](https://www.datocms.com/docs/next-js/setting-up-next-js-draft-mode)、[webhooks](https://www.datocms.com/docs/general-concepts/webhooks)、[roles](https://www.datocms.com/docs/general-concepts/roles-and-permission-system)、[project export](https://www.datocms.com/docs/import-and-export/datocms-site-export-feature)。
- Hygraph：[pricing](https://hygraph.com/pricing)、[plan limits](https://hygraph.com/docs/getting-started/update-billing)、[webhooks](https://hygraph.com/docs/developer-guides/webhooks/webhooks-overview)、[roles](https://hygraph.com/docs/getting-started/access-and-permissions/user-roles-and-permissions)、[live preview](https://hygraph.com/docs/developer-guides/schema/live-preview)、[reversibility FAQ](https://hygraph.com/faq)。
- Prismic：[pricing](https://prismic.io/pricing)、[Next.js](https://prismic.io/docs/nextjs)、[previews](https://prismic.io/docs/previews)、[webhooks](https://prismic.io/docs/webhooks)、[users](https://prismic.io/docs/users)、[fetch content](https://prismic.io/docs/fetch-content.md)。

### Self-hosted / hybrid / Git-based

- Payload：[self-host/MIT](https://payloadcms.com/get-started)、[deployment](https://payloadcms.com/docs/production/deployment)、[drafts](https://payloadcms.com/docs/versions/drafts)、[preview](https://payloadcms.com/docs/admin/preview)、[access control](https://payloadcms.com/docs/access-control/collections)、[import/export plugin](https://payloadcms.com/docs/plugins/import-export)、[GitHub](https://github.com/payloadcms/payload)。
- Strapi：[Cloud pricing](https://strapi.io/pricing-cloud)、[billing limits](https://docs.strapi.io/cloud/getting-started/usage-billing)、[Draft & Publish](https://docs.strapi.io/cms/features/draft-and-publish)、[webhooks](https://docs.strapi.io/cms/backend-customization/webhooks)、[export](https://docs.strapi.io/cms/data-management/export)、[GitHub](https://github.com/strapi/strapi)。
- Directus：[BSL](https://directus.io/bsl)、[schema snapshot](https://docs.directus.io/reference/system/schema)、[Vercel deployments](https://directus.io/docs/guides/integrations/vercel/deployments)、[GitHub](https://github.com/directus/directus)。
- Decap CMS：[overview](https://decapcms.org/)、[Next.js](https://decapcms.org/docs/nextjs/)、[configuration](https://decapcms.org/docs/configuration-options/)、[backends/OAuth](https://decapcms.org/docs/backends-overview/)、[editorial workflow preview](https://decapcms.org/docs/deploy-preview-links/)、[GitHub](https://github.com/decaporg/decap-cms)。

### 状态与安全入口

- Hosted 状态历史：[Sanity](https://status.sanity.io/)、[Contentful](https://contentful.statuspage.io/)、[DatoCMS](https://status.datocms.com/)。访问 2026-08-30。本文没有以短期 uptime 百分比外推长期可靠性。
- DatoCMS：[Security 与 vulnerability disclosure](https://www.datocms.com/security)（页面标注更新 2025-09-02）。其他候选若未来进入 PoC，必须从其 trust/security center 和 GitHub Security Advisories 重新做版本化核查；本阶段没有把“未找到公告”计为“无漏洞”。

所有以上产品页访问于 2026-08-30；未标明官方版本日期的页面按访问日快照处理。动态定价页在任何采购/PoC 前必须复核。

## 22. 完成边界确认

- 没有注册 CMS 账号、创建项目/token/webhook/env 或部署测试资源。
- 没有安装 CMS/SDK/CLI/npm 包，没有修改 `package.json`/lockfile 或应用代码。
- 本文没有开始 Phase 3C、3D 或 3E；仅给出其后续边界。
- 最终决定为 Sanity 单一 PoC 候选，候选数为 1，满足“不超过两个”。
