import type {StructureBuilder, StructureResolver} from 'sanity/structure'

const singletonTypes = new Set(['siteSettings', 'profile', 'homepage'])

const documentList = (S: StructureBuilder, type: string, title: string) =>
  S.listItem().id(type).title(title).schemaType(type).child(S.documentTypeList(type).title(title))

export const structure: StructureResolver = (S) =>
  S.list()
    .id('content')
    .title('内容管理')
    .items([
      S.listItem()
        .title('全局设置')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('个人资料')
        .id('profile')
        .child(S.document().schemaType('profile').documentId('profile')),
      S.listItem()
        .title('首页内容')
        .id('homepage')
        .child(S.document().schemaType('homepage').documentId('homepage')),
      S.divider(),
      documentList(S, 'experience', '工作经历'),
      documentList(S, 'education', '教育经历'),
      documentList(S, 'capabilityGroup', '能力分组'),
      documentList(S, 'project', '项目'),
      documentList(S, 'testimonial', 'Testimonials'),
      documentList(S, 'socialLink', '社交链接'),
      documentList(S, 'mediaRecord', '媒体'),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId()
        return id ? !singletonTypes.has(id) && id !== 'blockContent' && ![
          'experience',
          'education',
          'capabilityGroup',
          'project',
          'testimonial',
          'socialLink',
          'mediaRecord',
        ].includes(id) : true
      }),
    ])
