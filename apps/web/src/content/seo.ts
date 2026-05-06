import type { SeoFields } from './types'

const siteName = 'Побратими разом'
const siteUrl = import.meta.env.VITE_SITE_URL || 'https://pobratymy.com'

export function seoMeta(seo: SeoFields) {
  const title = seo.title.includes(siteName) ? seo.title : `${seo.title} - ${siteName}`

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
  ]
}

export function fallbackSeo(title: string, description: string): SeoFields {
  return {
    title,
    description,
  }
}
