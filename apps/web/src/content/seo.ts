import type { SeoFields } from './types'

const siteName = 'Побратими разом'
const siteUrl = import.meta.env.VITE_SITE_URL || 'https://pobratymy.com'

export function seoMeta(seo: SeoFields) {
  const title = seo.title.includes(siteName) ? seo.title : `${seo.title} - ${siteName}`
  const imageMeta = seo.image
    ? [
        {
          property: 'og:image',
          content: seo.image.url,
        },
        {
          property: 'og:image:alt',
          content: seo.image.decorative ? '' : (seo.image.alt ?? title),
        },
        {
          name: 'twitter:image',
          content: seo.image.url,
        },
      ]
    : []

  return [
    {
      title,
    },
    {
      name: 'description',
      content: seo.description,
    },
    {
      property: 'og:site_name',
      content: siteName,
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: seo.description,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: siteUrl,
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    ...imageMeta,
  ]
}

export function fallbackSeo(title: string, description: string): SeoFields {
  return {
    title,
    description,
  }
}
