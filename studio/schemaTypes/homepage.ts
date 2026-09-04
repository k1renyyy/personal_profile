import {defineArrayMember, defineField, defineType} from 'sanity'

const twoLines = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [defineArrayMember({type: 'string'})],
    validation: (rule) => rule.required().min(2).max(2),
  })

export const homepage = defineType({
  name: 'homepage',
  title: '首页内容',
  type: 'document',
  fields: [
    twoLines('heroTitleLines', 'Hero 职业标题（两行）'),
    twoLines('heroNameLines', 'Hero 姓名（两行）'),
    defineField({name: 'heroTechChips', title: 'Hero 能力标签', type: 'array', of: [defineArrayMember({type: 'string'})], validation: (rule) => rule.required().min(1).max(6).unique()}),
    defineField({name: 'regionLabel', title: '地区短句', type: 'string', validation: (rule) => rule.required()}),
    twoLines('valuePropositionLines', '价值主张（两行）'),
    defineField({name: 'availability', title: '合作状态', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'primaryCtaLabel', title: '主按钮文案', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'aboutTitle', title: '个人介绍大标题', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'aboutLabel', title: '个人介绍小标题', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'about', title: 'About 内容', type: 'blockContent', validation: (rule) => rule.required().min(1)}),
    defineField({
      name: 'aboutPhotos',
      title: '个人介绍照片（3 张）',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'mediaRecord'}]})],
      validation: (rule) => rule.length(3).unique(),
    }),
    twoLines('marqueePrimaryLines', 'Marquee 主标题（两项）'),
    twoLines('marqueeSecondaryLines', 'Marquee 次标题（两项）'),
    defineField({name: 'skillTickerItems', title: '底部能力滚动条', type: 'array', of: [defineArrayMember({type: 'string'})], validation: (rule) => rule.required().min(1).max(24).unique()}),
    defineField({name: 'experienceTitle', title: 'Experience 标题', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'experienceLabel', title: 'Experience 小标题', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'experienceIntro', title: 'Experience 介绍', type: 'text', rows: 3, validation: (rule) => rule.required()}),
    defineField({name: 'projectsTitle', title: 'Projects 标题', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'projectsLabel', title: 'Projects 小标题', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'projectsIntro', title: 'Projects 介绍', type: 'text', rows: 3, validation: (rule) => rule.required()}),
    defineField({name: 'testimonialsTitle', title: 'Testimonials 标题', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'testimonialsIntro', title: 'Testimonials 介绍', type: 'text', rows: 3, validation: (rule) => rule.required()}),
    twoLines('contactTitleLines', 'Contact 标题（两行）'),
    defineField({name: 'contactInvitation', title: '联系邀请文案', type: 'text', rows: 3, validation: (rule) => rule.required()}),
  ],
})
