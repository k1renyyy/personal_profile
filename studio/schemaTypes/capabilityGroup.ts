import {defineArrayMember, defineField, defineType} from 'sanity'

export const capabilityGroup = defineType({
  name: 'capabilityGroup',
  title: '能力分组',
  type: 'document',
  fields: [
    defineField({name: 'name', title: '分组名称', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'items', title: '能力条目', type: 'array', of: [defineArrayMember({type: 'string'})], validation: (rule) => rule.required().min(1).unique()}),
    defineField({name: 'order', title: '排序', type: 'number', validation: (rule) => rule.required().integer().min(0)}),
    defineField({name: 'isVisible', title: '在网站显示', type: 'boolean', initialValue: false, validation: (rule) => rule.required()}),
  ],
  orderings: [{title: '展示顺序', name: 'displayOrder', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'name'}},
})
