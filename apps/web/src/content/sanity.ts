import { seedContent } from './seed'
import type {
  CollectionItem,
  ContentBlock,
  GalleryAlbum,
  NewsPost,
  PageContent,
  Project,
  RouteId,
  SeoFields,
  SiteContent,
  VideoItem,
} from './types'

const routePaths: Record<RouteId, string> = {
  home: '/',
  aboutUs: '/about-us/',
  about: '/pro-nas/',
  contacts: '/contacts/',
  help: '/dopomogty/',
  civicUnion: '/gromadska-spilka/',
  mediaInfo: '/informatsiia-dlia-zmi/',
}

const routeEyebrows: Record<RouteId, string> = {
  home: 'Головна',
  aboutUs: 'Legacy route',
  about: 'Про нас',
  contacts: 'Контакти',
  help: 'Як допомогти',
  civicUnion: 'Громадська спілка',
  mediaInfo: 'Для ЗМІ',
}

const contentQuery = `{
  "settings": *[_type == "siteSettings"][0]{
    title,
    phone,
    email,
    address,
    socialLinks,
    donationDetails,
    defaultSeo
  },
  "pages": *[_type == "page"]{
    routeId,
    title,
    summary,
    body,
    seo
  },
  "newsPosts": *[_type == "newsPost"] | order(publishedAt desc){
    title,
    "slug": slug.current,
    publishedAt,
    summary,
    body,
    seo
  },
  "projects": *[_type == "project"] | order(title asc){
    title,
    "slug": slug.current,
    status,
    summary,
    body,
    seo
  },
  "galleryAlbums": *[_type == "galleryAlbum"] | order(date desc){
    title,
    "slug": slug.current,
    date,
    "summary": pt::text(description)
  },
  "videos": *[_type == "video"] | order(publishedAt desc){
    title,
    "slug": slug.current,
    publishedAt,
    sourceUrl,
    "summary": description
  }
}`

interface SanityQueryResponse {
  result?: {
    settings?: Partial<SiteContent['settings']>
    pages?: Array<Partial<PageContent>>
    newsPosts?: Array<Partial<NewsPost>>
    projects?: Array<Partial<Project>>
    galleryAlbums?: Array<Partial<GalleryAlbum>>
    videos?: Array<Partial<VideoItem>>
  }
}

let contentPromise: Promise<SiteContent> | undefined

export function getSiteContent() {
  contentPromise ??= loadSiteContent()

  return contentPromise
}

export async function getPageContent(routeId: RouteId) {
  const content = await getSiteContent()

  return content.pages[routeId]
}

export async function getNewsPost(slug: string) {
  const content = await getSiteContent()

  return content.newsPosts.find((post) => post.slug === slug) ?? null
}

export async function getProject(slug: string) {
  const content = await getSiteContent()

  return content.projects.find((project) => project.slug === slug) ?? null
}

export async function getGalleryAlbum(slug: string) {
  const content = await getSiteContent()

  return content.galleryAlbums.find((album) => album.slug === slug) ?? null
}

async function loadSiteContent(): Promise<SiteContent> {
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
  const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'

  if (!projectId || projectId === 'replace-me') {
    return seedContent
  }

  try {
    const params = new URLSearchParams({ query: contentQuery })
    const url = `https://${projectId}.api.sanity.io/v2025-05-06/data/query/${dataset}?${params}`
    const response = await fetch(url)

    if (!response.ok) {
      return seedContent
    }

    const payload = (await response.json()) as SanityQueryResponse

    return normalizeContent(payload.result)
  } catch {
    return seedContent
  }
}

function normalizeContent(result: SanityQueryResponse['result']): SiteContent {
  if (!result) {
    return seedContent
  }

  const pages = { ...seedContent.pages }

  for (const page of result.pages ?? []) {
    if (!isRouteId(page.routeId) || !page.title || !page.summary) {
      continue
    }

    pages[page.routeId] = {
      routeId: page.routeId,
      path: routePaths[page.routeId],
      eyebrow: routeEyebrows[page.routeId],
      title: page.title,
      summary: page.summary,
      body: normalizeBlocks(page.body),
      seo: normalizeSeo(page.seo, page.title, page.summary),
    }
  }

  return {
    settings: {
      ...seedContent.settings,
      ...result.settings,
      socialLinks: result.settings?.socialLinks ?? seedContent.settings.socialLinks,
      donationDetails:
        result.settings?.donationDetails ?? seedContent.settings.donationDetails,
      defaultSeo: result.settings?.defaultSeo ?? seedContent.settings.defaultSeo,
    },
    home: seedContent.home,
    pages,
    newsPosts: normalizeNewsPosts(result.newsPosts),
    projects: normalizeProjects(result.projects),
    galleryAlbums: normalizeAlbums(result.galleryAlbums),
    videos: normalizeVideos(result.videos),
  }
}

function normalizeNewsPosts(posts: Array<Partial<NewsPost>> | undefined) {
  const normalized = (posts ?? [])
    .filter((post) => post.title && post.slug && post.summary && post.publishedAt)
    .map<NewsPost>((post) => ({
      title: post.title!,
      slug: post.slug!,
      summary: post.summary!,
      publishedAt: post.publishedAt!,
      date: post.publishedAt!.slice(0, 10),
      href: `/novyny/${post.slug!}/`,
      body: normalizeBlocks(post.body),
      seo: normalizeSeo(post.seo, post.title!, post.summary!),
    }))

  return normalized.length > 0 ? normalized : seedContent.newsPosts
}

function normalizeProjects(projects: Array<Partial<Project>> | undefined) {
  const normalized = (projects ?? [])
    .filter((project) => project.title && project.slug && project.summary)
    .map<Project>((project) => ({
      title: project.title!,
      slug: project.slug!,
      summary: project.summary!,
      status: project.status ?? 'active',
      href: `/proekty/${project.slug!}/`,
      body: normalizeBlocks(project.body),
      seo: normalizeSeo(project.seo, project.title!, project.summary!),
    }))

  return normalized.length > 0 ? normalized : seedContent.projects
}

function normalizeAlbums(albums: Array<Partial<GalleryAlbum>> | undefined) {
  const normalized = (albums ?? [])
    .filter((album) => album.title && album.slug && album.date)
    .map<GalleryAlbum>((album) => ({
      title: album.title!,
      slug: album.slug!,
      summary: album.summary ?? 'Фотоальбом організації.',
      date: album.date!,
      href: `/galereia/${album.slug!}/`,
    }))

  return normalized.length > 0 ? normalized : seedContent.galleryAlbums
}

function normalizeVideos(videos: Array<Partial<VideoItem>> | undefined) {
  const normalized = (videos ?? [])
    .filter((video) => video.title && video.sourceUrl)
    .map<VideoItem>((video) => {
      const slug = video.slug ?? slugify(video.title!)

      return {
        title: video.title!,
        slug,
        summary: video.summary ?? 'Відеоматеріал організації.',
        publishedAt: video.publishedAt ?? '',
        date: video.publishedAt?.slice(0, 10),
        href: `/video/#${slug}`,
        sourceUrl: video.sourceUrl!,
      }
    })

  return normalized.length > 0 ? normalized : seedContent.videos
}

function normalizeSeo(
  seo: Partial<SeoFields> | undefined,
  fallbackTitle: string,
  fallbackDescription: string,
): SeoFields {
  return {
    title: seo?.title ?? fallbackTitle,
    description: seo?.description ?? fallbackDescription,
  }
}

function normalizeBlocks(value: unknown): ContentBlock[] {
  if (!Array.isArray(value)) {
    return []
  }

  const blocks: ContentBlock[] = []
  let pendingList: { style: 'bullet' | 'number'; items: string[] } | undefined

  const flushList = () => {
    if (pendingList) {
      blocks.push({
        type: 'list',
        style: pendingList.style,
        items: pendingList.items,
      })
      pendingList = undefined
    }
  }

  for (const block of value) {
    if (!isRecord(block)) {
      continue
    }

    if (block._type === 'callout' && typeof block.text === 'string') {
      flushList()
      blocks.push({
        type: 'callout',
        tone: block.tone === 'important' ? 'important' : 'info',
        text: block.text,
      })
      continue
    }

    if (block._type !== 'block') {
      continue
    }

    const text = plainText(block.children)

    if (!text) {
      continue
    }

    if (block.listItem === 'bullet' || block.listItem === 'number') {
      const style = block.listItem

      if (pendingList?.style !== style) {
        flushList()
        pendingList = { style, items: [] }
      }

      pendingList.items.push(text)
      continue
    }

    flushList()

    if (block.style === 'h2' || block.style === 'h3') {
      blocks.push({
        type: 'heading',
        level: block.style === 'h2' ? 2 : 3,
        text,
      })
    } else if (block.style === 'blockquote') {
      blocks.push({
        type: 'quote',
        text,
      })
    } else {
      blocks.push({
        type: 'paragraph',
        text,
      })
    }
  }

  flushList()

  return blocks
}

function plainText(value: unknown) {
  if (!Array.isArray(value)) {
    return ''
  }

  return value
    .map((child) =>
      isRecord(child) && typeof child.text === 'string' ? child.text : '',
    )
    .join('')
    .trim()
}

function isRouteId(value: unknown): value is RouteId {
  return typeof value === 'string' && value in routePaths
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replaceAll(/[^a-z0-9а-яіїєґ]+/giu, '-')
    .replaceAll(/^-+|-+$/gu, '')
}

export function toCollectionItems(items: CollectionItem[]) {
  return items.map((item) => ({
    title: item.title,
    summary: item.summary,
    href: item.href,
    date: item.date,
  }))
}
