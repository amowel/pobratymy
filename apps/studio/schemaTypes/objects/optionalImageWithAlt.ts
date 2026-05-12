import { ImageIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const optionalImageWithAlt = defineType({
  name: 'optionalImageWithAlt',
  title: 'Optional image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description:
        'Describe the image for accessibility. Leave empty only when the image is decorative.',
      hidden: ({ parent }) => Boolean(parent?.decorative) || !hasImage(parent),
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as
            | { decorative?: boolean; image?: unknown }
            | undefined

          if (!hasImage(parent) || parent?.decorative || value) {
            return true
          }

          return 'Alt text is required unless the image is marked decorative.'
        }),
    }),
    defineField({
      name: 'decorative',
      title: 'Decorative image',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => !hasImage(parent),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      hidden: ({ parent }) => !hasImage(parent),
    }),
  ],
  preview: {
    select: {
      title: 'alt',
      subtitle: 'caption',
      media: 'image',
    },
  },
})

function hasImage(parent: unknown) {
  return (
    typeof parent === 'object' &&
    parent !== null &&
    'image' in parent &&
    Boolean(parent.image)
  )
}
