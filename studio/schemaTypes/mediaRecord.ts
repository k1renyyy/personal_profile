import {defineArrayMember, defineField, defineType} from 'sanity'

const placements = [
  {title: '头像', value: 'portrait'},
  {title: '默认分享图', value: 'default-share-image'},
  {title: 'Testimonial 头像', value: 'testimonial-portrait'},
  {title: '个人介绍照片', value: 'about-photo'},
]

export const mediaRecord = defineType({
  name: 'mediaRecord',
  title: '媒体记录',
  type: 'document',
  fields: [
    defineField({
      name: 'asset',
      title: '原始图片',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: '内部标签',
      type: 'string',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'alt',
      title: '替代文本',
      type: 'string',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({name: 'caption', title: '图片说明', type: 'text', rows: 2}),
    defineField({
      name: 'source',
      title: '来源或来源网址',
      type: 'string',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'rightsStatus',
      title: '权利状态',
      type: 'string',
      options: {
        list: [
          {title: '未知', value: 'unknown'},
          {title: '自有', value: 'owned'},
          {title: '已许可', value: 'licensed'},
          {title: '已获授权', value: 'permission-granted'},
          {title: '受限', value: 'restricted'},
        ],
        layout: 'radio',
      },
      validation: (rule) =>
        rule.required().custom((status) =>
          status === 'unknown' || status === 'restricted'
            ? '未知或受限媒体不得用于网站发布'
            : true,
        ),
    }),
    defineField({
      name: 'attribution',
      title: '署名或权利依据',
      type: 'text',
      rows: 2,
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {rightsStatus?: string} | undefined
          return parent?.rightsStatus !== 'licensed' || value?.trim()
            ? true
            : '许可媒体必须填写署名或权利依据'
        }),
    }),
    defineField({
      name: 'placements',
      title: '用途',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {list: placements},
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: 'originalDimensions',
      title: '原始尺寸',
      type: 'object',
      fields: [
        defineField({name: 'width', title: '宽度', type: 'number', validation: (rule) => rule.required().integer().positive()}),
        defineField({name: 'height', title: '高度', type: 'number', validation: (rule) => rule.required().integer().positive()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'targetAspectRatio',
      title: '目标宽高比',
      type: 'string',
      description: '例如 1:1 或 16:9',
      validation: (rule) => rule.required().regex(/^\d+(?:\.\d+)?:\d+(?:\.\d+)?$/),
    }),
    defineField({
      name: 'focalPoint',
      title: '可选焦点',
      type: 'object',
      fields: [
        defineField({
          name: 'x',
          title: 'Horizontal position',
          type: 'number',
          validation: (rule) => rule.min(0).max(1),
        }),
        defineField({
          name: 'y',
          title: 'Vertical position',
          type: 'number',
          validation: (rule) => rule.min(0).max(1),
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'label', media: 'asset', subtitle: 'rightsStatus'},
  },
})
