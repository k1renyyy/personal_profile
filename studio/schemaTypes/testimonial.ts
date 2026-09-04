import {defineField, defineType} from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    defineField({name: 'personName', title: '推荐人姓名', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'personRole', title: '推荐人职位', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'company', title: '公司或组织', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'relationship', title: '关系', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'quote', title: '推荐原文', type: 'text', rows: 6, validation: (rule) => rule.required()}),
    defineField({name: 'date', title: '日期', type: 'date'}),
    defineField({name: 'portrait', title: '头像', type: 'reference', to: [{type: 'mediaRecord'}]}),
    defineField({name: 'permissionStatus', title: '公开授权状态', type: 'string', options: {list: [{title: '待确认', value: 'pending'}, {title: '已明确授权', value: 'granted'}, {title: '已拒绝', value: 'denied'}]}, validation: (rule) => rule.required()}),
    defineField({name: 'permissionNote', title: '授权备注（不存放私密证据）', type: 'text', rows: 2}),
    defineField({name: 'order', title: '排序', type: 'number', validation: (rule) => rule.required().integer().min(0)}),
    defineField({
      name: 'isVisible',
      title: '在网站显示',
      type: 'boolean',
      initialValue: false,
      validation: (rule) => rule.required().custom((isVisible, context) => {
        const parent = context.parent as {permissionStatus?: string} | undefined
        return !isVisible || parent?.permissionStatus === 'granted'
          ? true
          : '公开显示前必须取得明确授权'
      }),
    }),
  ],
  orderings: [{title: '展示顺序', name: 'displayOrder', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'personName', role: 'personRole', company: 'company'}, prepare({title, role, company}) { return {title, subtitle: [role, company].filter(Boolean).join(' · ')} }},
})
