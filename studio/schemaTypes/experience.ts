import {defineArrayMember, defineField, defineType} from 'sanity'

export const experience = defineType({
  name: 'experience',
  title: '工作经历',
  type: 'document',
  fields: [
    defineField({name: 'company', title: '公司或组织', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'role', title: '职位', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'timeLabel', title: '时间文案', description: '按页面要显示的格式填写，例如 2025.06 — PRESENT', type: 'string', validation: (rule) => rule.required().max(40)}),
    defineField({name: 'outcomes', title: '成果', type: 'array', of: [defineArrayMember({type: 'string'})], validation: (rule) => rule.required().min(1).max(4)}),
    defineField({name: 'order', title: '排序', type: 'number', validation: (rule) => rule.required().integer().min(0)}),
    defineField({name: 'isVisible', title: '在网站显示', type: 'boolean', initialValue: false, validation: (rule) => rule.required()}),
  ],
  orderings: [{title: '展示顺序', name: 'displayOrder', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'company', role: 'role'}, prepare({title, role}) { return {title, subtitle: role} }},
})
