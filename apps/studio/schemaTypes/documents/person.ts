import { UserIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const person = defineType({
  name: 'person',
  title: 'People',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'portableText',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'photo.image',
    },
  },
})
