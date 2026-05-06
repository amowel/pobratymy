import { defineField, defineType } from 'sanity'

const fixedRoutes = [
  { title: '/', value: 'home' },
  { title: '/about-us/', value: 'aboutUs' },
  { title: '/contacts/', value: 'contacts' },
  { title: '/dopomogty/', value: 'help' },
  { title: '/gromadska-spilka/', value: 'civicUnion' },
  { title: '/informatsiia-dlia-zmi/', value: 'mediaInfo' },
  { title: '/pro-nas/', value: 'about' },
]

export const page = defineType({
  name: 'page',
  title: 'Pages',
  type: 'document',
  fields: [
    defineField({
      name: 'routeId',
      title: 'Fixed route',
      type: 'string',
      options: {
        list: fixedRoutes,
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableText',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
    }),
  ],
})
