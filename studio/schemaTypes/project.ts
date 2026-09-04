import {defineArrayMember, defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: '项目',
  type: 'document',
  fields: [
    defineField({name: 'name', title: '项目名称', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'projectType', title: '项目类型', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'role', title: '个人角色', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'summary',
      title: '摘要',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'outcomes',
      title: '项目成果',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.required().min(1).max(4),
    }),
    defineField({
      name: 'capabilities',
      title: '能力标签',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.required().min(1).max(6).unique(),
    }),
    defineField({
      name: 'order',
      title: '排序',
      type: 'number',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'isVisible',
      title: '在网站显示',
      type: 'boolean',
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [{title: '展示顺序', name: 'displayOrder', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', role: 'role', projectType: 'projectType'},
    prepare({title, role, projectType}) {
      return {title, subtitle: [projectType, role].filter(Boolean).join(' · ')}
    },
  },
})
