import { LinkIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const navLink = defineType({
  name: 'navLink',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Path or URL',
      type: 'string',
      description: 'Use an internal path like /proekty/ or a full https:// URL.',
      validation: (rule) =>
        rule.required().custom((href) => {
          if (!href) {
            return true
          }

          return (
            href.startsWith('/') ||
            href.startsWith('https://') ||
            href.startsWith('http://') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            'Use /path/, https://, mailto:, or tel:.'
          )
        }),
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'href',
    },
  },
})
