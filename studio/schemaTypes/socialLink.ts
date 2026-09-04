import {defineField, defineType} from 'sanity'
import {isHttpsUrl, isMailtoUrl} from './validation'

export const socialLink = defineType({
  name: 'socialLink',
  title: '社交链接',
  type: 'document',
  fields: [
    defineField({name: 'platform', title: '平台', type: 'string', options: {list: [{title: 'Email', value: 'email'}, {title: 'GitHub', value: 'github'}, {title: 'LinkedIn', value: 'linkedin'}]}, validation: (rule) => rule.required()}),
    defineField({name: 'label', title: '显示文案', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'url', title: '目标地址', type: 'string', validation: (rule) => rule.required().custom((value, context) => { const platform = (context.parent as {platform?: string} | undefined)?.platform; return value && (platform === 'email' ? isMailtoUrl(value) : isHttpsUrl(value)) ? true : '邮箱使用 mailto: 地址，网站使用 HTTPS 地址' })}),
    defineField({name: 'accessibilityLabel', title: '无障碍标签', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'order', title: '排序', type: 'number', validation: (rule) => rule.required().integer().min(0)}),
    defineField({name: 'isVisible', title: '在网站显示', type: 'boolean', initialValue: false, validation: (rule) => rule.required()}),
  ],
  orderings: [{title: '展示顺序', name: 'displayOrder', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'label', subtitle: 'platform'}},
})
