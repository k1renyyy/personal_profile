import {defineArrayMember, defineField, defineType} from 'sanity'

export const profile = defineType({
  name: 'profile',
  title: '个人资料',
  type: 'document',
  fields: [
    defineField({name: 'name', title: '中文姓名', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'englishName', title: '英文姓名', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'professionalTitle',
      title: '职业名称',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'locations',
      title: '所在地',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({name: 'timezone', title: '时区', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'availability',
      title: '合作状态',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortBio',
      title: '简短介绍',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fullBio',
      title: '完整介绍',
      type: 'blockContent',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'portrait',
      title: '头像',
      type: 'reference',
      to: [{type: 'mediaRecord'}],
    }),
  ],
})
