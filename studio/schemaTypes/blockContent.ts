import {defineArrayMember, defineField, defineType} from 'sanity'

export const blockContent = defineType({
  name: 'blockContent',
  title: 'Controlled rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading 2', value: 'h2'},
        {title: 'Heading 3', value: 'h3'},
      ],
      lists: [
        {title: 'Bulleted list', value: 'bullet'},
        {title: 'Numbered list', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
        ],
        annotations: [
          defineField({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'HTTPS URL',
                type: 'url',
                validation: (rule) =>
                  rule.required().uri({scheme: ['https']}).error('Use a valid HTTPS URL'),
              }),
            ],
          }),
        ],
      },
    }),
  ],
})
