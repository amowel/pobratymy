import { PlayIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'
import { validateSlug } from '../lib/validation'

export const video = defineType({
  name: 'video',
  title: 'Videos',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required().custom(validateSlug),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
      validation: (rule) =>
        rule
          .required()
          .uri({
            scheme: ['http', 'https'],
          })
          .custom((sourceUrl) => {
            if (!sourceUrl) {
              return true
            }

            try {
              const url = new URL(sourceUrl)
              const host = url.hostname.replace(/^www\./u, '')
              const isYouTube =
                host === 'youtu.be' ||
                host === 'youtube.com' ||
                host === 'm.youtube.com' ||
                host.endsWith('.youtube.com')
              const isVimeo = host === 'vimeo.com' || host === 'player.vimeo.com'

              return (
                isYouTube ||
                isVimeo ||
                'Use a YouTube or Vimeo URL so the website can embed the video.'
              )
            } catch {
              return 'Enter a valid video URL.'
            }
          }),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) =>
        rule.max(220).warning('Keep descriptions concise for video cards.'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
      media: 'thumbnail.image',
    },
  },
})
