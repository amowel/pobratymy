import { PlayIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'
import { validateSlug } from '../lib/validation'

const validationApiVersion = '2026-05-06'
const maxUploadedVideoBytes = 25 * 1024 * 1024
const maxUploadedVideoMegabytes = maxUploadedVideoBytes / 1024 / 1024

export const video = defineType({
  name: 'video',
  title: 'Videos',
  type: 'document',
  icon: PlayIcon,
  validation: (rule) =>
    rule.custom((document) => {
      const sourceUrl =
        typeof document?.sourceUrl === 'string' ? document.sourceUrl.trim() : ''
      const uploadedVideo = document?.uploadedVideo as { asset?: unknown } | undefined

      if (sourceUrl || uploadedVideo?.asset) {
        return true
      }

      return 'Add a YouTube/Vimeo source URL or upload a video file.'
    }),
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
      name: 'uploadedVideo',
      title: 'Uploaded video',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      description:
        'Prefer YouTube or Vimeo for public videos. Use Sanity uploads only for short clips under 25 MB to stay within the free plan.',
      validation: (rule) =>
        rule.custom(async (uploadedVideo, context) => {
          const assetRef =
            typeof uploadedVideo === 'object' &&
            uploadedVideo !== null &&
            'asset' in uploadedVideo &&
            typeof uploadedVideo.asset === 'object' &&
            uploadedVideo.asset !== null &&
            '_ref' in uploadedVideo.asset &&
            typeof uploadedVideo.asset._ref === 'string'
              ? uploadedVideo.asset._ref
              : undefined

          if (!assetRef) {
            return true
          }

          const client = context.getClient({ apiVersion: validationApiVersion })
          const asset = await client.fetch<{ size?: number } | null>(
            '*[_id == $assetRef][0]{size}',
            { assetRef },
          )

          if (!asset?.size || asset.size <= maxUploadedVideoBytes) {
            return true
          }

          return `Keep uploaded videos under ${maxUploadedVideoMegabytes} MB. Use YouTube or Vimeo for larger files.`
        }),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'optionalImageWithAlt',
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
