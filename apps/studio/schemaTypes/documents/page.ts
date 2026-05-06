import { DocumentIcon } from '@sanity/icons'
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
const fixedRouteValues = new Set(fixedRoutes.map((route) => route.value))
const validationApiVersion = '2026-05-06'

export const page = defineType({
  name: 'page',
  title: 'Pages',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'routeId',
      title: 'Fixed route',
      type: 'string',
      options: {
        list: fixedRoutes,
        layout: 'dropdown',
      },
      validation: (rule) =>
        rule.required().custom(async (routeId, context) => {
          if (typeof routeId !== 'string') {
            return 'Choose a fixed route.'
          }

          if (!fixedRouteValues.has(routeId)) {
            return 'Choose a valid fixed route.'
          }

          const currentId = context.document?._id

          if (typeof currentId !== 'string') {
            return true
          }

          const publishedId = currentId.replace(/^drafts\./u, '')
          const draftId = `drafts.${publishedId}`
          const client = context.getClient({ apiVersion: validationApiVersion })
          const duplicateCount = await client.fetch<number>(
            'count(*[_type == "page" && routeId == $routeId && !(_id in $ids)])',
            { routeId, ids: [publishedId, draftId] },
          )

          return duplicateCount === 0 || 'Only one page can use each fixed route.'
        }),
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
      validation: (rule) => [
        rule.required(),
        rule.max(260).warning('Keep summaries concise for previews and SEO.'),
      ],
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'routeId',
      media: 'coverImage.image',
    },
  },
})
