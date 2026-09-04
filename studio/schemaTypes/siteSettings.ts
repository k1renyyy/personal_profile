import {defineField, defineType} from 'sanity'
import {isHttpsUrl} from './validation'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: '站点设置',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: '站点标题',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'siteDescription',
      title: '站点描述',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'canonicalUrl',
      title: '正式网址',
      type: 'url',
      validation: (rule) =>
        rule.custom((value) =>
          !value || isHttpsUrl(value) ? true : '请输入有效的 HTTPS 网址',
        ),
    }),
    defineField({
      name: 'socialName',
      title: '社交分享名称',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'allowIndexing',
      title: '允许搜索引擎收录',
      type: 'boolean',
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'defaultShareImage',
      title: '默认分享图',
      type: 'reference',
      to: [{type: 'mediaRecord'}],
    }),
  ],
})
