import { createServerFn } from '@tanstack/react-start'
import { getCachedSiteContent } from './sanity.server'
import type { CollectionItem, RouteId } from './types'

const routeIds = [
  'home',
  'aboutUs',
  'about',
  'contacts',
  'help',
  'civicUnion',
  'mediaInfo',
] as const satisfies readonly RouteId[]

export const getSiteContent = createServerFn({ method: 'GET' }).handler(() =>
  getCachedSiteContent(),
)

export const getPageContent = createServerFn({ method: 'GET' })
  .inputValidator(validateRouteId)
  .handler(async ({ data: routeId }) => {
    const content = await getCachedSiteContent()

    return content.pages[routeId]
  })

export const getNewsPost = createServerFn({ method: 'GET' })
  .inputValidator(validateSlug)
  .handler(async ({ data: slug }) => {
    const content = await getCachedSiteContent()

    return content.newsPosts.find((post) => post.slug === slug) ?? null
  })

export const getProject = createServerFn({ method: 'GET' })
  .inputValidator(validateSlug)
  .handler(async ({ data: slug }) => {
    const content = await getCachedSiteContent()

    return content.projects.find((project) => project.slug === slug) ?? null
  })

export const getGalleryAlbum = createServerFn({ method: 'GET' })
  .inputValidator(validateSlug)
  .handler(async ({ data: slug }) => {
    const content = await getCachedSiteContent()

    return content.galleryAlbums.find((album) => album.slug === slug) ?? null
  })

function validateRouteId(value: unknown): RouteId {
  if (typeof value === 'string' && routeIds.includes(value as RouteId)) {
    return value as RouteId
  }

  throw new Error('Invalid page route')
}

function validateSlug(value: unknown) {
  if (typeof value !== 'string') {
    throw new TypeError('Invalid slug')
  }

  const slug = value.trim()

  if (!slug || slug.length > 160 || slug.includes('/') || slug.includes('?')) {
    throw new Error('Invalid slug')
  }

  return slug
}

export function toCollectionItems(items: CollectionItem[]) {
  return items.map((item) => ({
    title: item.title,
    summary: item.summary,
    href: item.href,
    date: item.date,
  }))
}
