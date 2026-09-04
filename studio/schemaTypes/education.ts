import {defineArrayMember, defineField, defineType} from 'sanity'
import {isHttpsUrl, isYearMonth} from './validation'

const monthValidation = (value: string | undefined) =>
  !value || isYearMonth(value) ? true : '请使用 YYYY-MM 格式'

export const education = defineType({
  name: 'education',
  title: '教育经历',
  type: 'document',
  fields: [
    defineField({name: 'institution', title: '院校', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'degree', title: '学位', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'fieldOfStudy', title: '专业', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'location', title: '地点', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'startDate', title: '开始年月', type: 'string', validation: (rule) => rule.required().custom(monthValidation)}),
    defineField({name: 'endDate', title: '结束年月', type: 'string', validation: (rule) => rule.required().custom(monthValidation)}),
    defineField({name: 'isExpected', title: '是否为预计完成时间', type: 'boolean', initialValue: false, validation: (rule) => rule.required()}),
    defineField({name: 'description', title: '说明', type: 'text', rows: 3}),
    defineField({name: 'highlights', title: '成果、课程或荣誉', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'relatedUrl', title: '相关链接', type: 'url', validation: (rule) => rule.custom((value) => !value || isHttpsUrl(value) ? true : '请输入有效的 HTTPS 网址')}),
    defineField({name: 'order', title: '排序', type: 'number', validation: (rule) => rule.required().integer().min(0)}),
    defineField({name: 'isVisible', title: '在网站显示', type: 'boolean', initialValue: false, validation: (rule) => rule.required()}),
  ],
  orderings: [{title: '展示顺序', name: 'displayOrder', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'institution', subtitle: 'degree'}},
})
