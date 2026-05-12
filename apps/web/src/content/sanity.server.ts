import { defineQuery } from 'groq'
import { seedContent } from './seed'
import type {
  ContentBlock,
  GalleryAlbum,
  ImageAttachment,
  LinkItem,
  NewsPost,
  PageContent,
  Person,
  Project,
  RichTextInline,
  RouteId,
  SeoFields,
  SiteContent,
  VideoAsset,
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

const sanityApiVersion = '2026-05-06'

const imageWithAltFields = `
  _key,
  alt,
  decorative,
  caption,
  "url": image.asset->url
`

const seoFields = `
  title,
  description,
  image{
    ${imageWithAltFields}
  }
`

const portableTextFields = `
  ...,
  _type == "imageWithAlt" => {
    ${imageWithAltFields}
  }
`

const siteContentQuery = defineQuery(`{
  "settings": *[_id == "siteSettings"][0]{
    title,
    description,
    logo{
      ${imageWithAltFields}
    },
    favicon{
      ${imageWithAltFields}
    },
    navigationLinks[]{
      label,
      href
    },
    supportCta{
      label,
      href
    },
    footerLinks[]{
      label,
      href
    },
    phone,
    email,
    address,
    socialLinks[]{
      label,
      url
    },
    donationDetails[]{
      label,
      value
    },
    defaultSeo{
      ${seoFields}
    }
  },
  "pages": *[_type == "page" && defined(routeId)]{
    routeId,
    title,
    summary,
    coverImage{
      ${imageWithAltFields}
    },
    primaryCta{
      label,
      href
    },
    secondaryCta{
      label,
      href
    },
    proofPoints[]{
      label,
      value
    },
    "featuredProjects": featuredProjects[]->slug.current,
    "featuredNews": featuredNews[]->slug.current,
    body[]{
      ${portableTextFields}
    },
    seo{
      ${seoFields}
    }
  },
  "newsPosts": *[_type == "newsPost" && defined(slug.current)] | order(publishedAt desc, _id asc){
    title,
    "slug": slug.current,
    publishedAt,
    summary,
    coverImage{
      ${imageWithAltFields}
    },
    body[]{
      ${portableTextFields}
    },
    seo{
      ${seoFields}
    }
  },
  "projects": *[_type == "project" && defined(slug.current)] | order(title asc, _id asc){
    title,
    "slug": slug.current,
    status,
    summary,
    coverImage{
      ${imageWithAltFields}
    },
    body[]{
      ${portableTextFields}
    },
    gallery[]{
      ${imageWithAltFields}
    },
    seo{
      ${seoFields}
    }
  },
  "galleryAlbums": *[_type == "galleryAlbum" && defined(slug.current)] | order(date desc, _id asc){
    title,
    "slug": slug.current,
    date,
    coverImage{
      ${imageWithAltFields}
    },
    photos[]{
      ${imageWithAltFields}
    },
    "body": description[]{
      ${portableTextFields}
    },
    "summary": coalesce(pt::text(description), "")
  },
  "videos": *[_type == "video" && defined(slug.current)] | order(publishedAt desc, _id asc){
    title,
    "slug": slug.current,
    publishedAt,
    sourceUrl,
    "uploadedVideo": uploadedVideo.asset->{
      url,
      mimeType,
      originalFilename
    },
    thumbnail{
      ${imageWithAltFields}
    },
    "summary": description
  },
  "people": *[_type == "person"] | order(name asc, _id asc){
    name,
    role,
    photo{
      ${imageWithAltFields}
    },
    bio[]{
      ${portableTextFields}
    }
  }
}`)

interface SanityQueryResponse {
  result?: {
    settings?: Partial<SiteContent['settings']>
    pages?: Array<Partial<PageContent>>
    newsPosts?: Array<Partial<NewsPost>>
    projects?: Array<Partial<Project>>
    galleryAlbums?: Array<Partial<GalleryAlbum>>
    videos?: Array<Partial<VideoItem>>
    people?: Array<Partial<Person>>
  }
}

let contentPromise: Promise<SiteContent> | undefined

export function getCachedSiteContent() {
  contentPromise ??= loadSiteContent()

  return contentPromise
}

async function loadSiteContent(): Promise<SiteContent> {
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
  const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'

  if (!projectId || projectId === 'replace-me') {
    return seedContent
  }

  try {
    const params = new URLSearchParams({ query: siteContentQuery })
    const url = `https://${projectId}.api.sanity.io/v${sanityApiVersion}/data/query/${dataset}?${params}`
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
      coverImage: normalizeImage(page.coverImage),
      primaryCta: normalizeLink(page.primaryCta),
      secondaryCta: normalizeLink(page.secondaryCta),
      proofPoints: normalizeProofPoints(page.proofPoints),
      featuredProjects: normalizeSlugList(page.featuredProjects),
      featuredNews: normalizeSlugList(page.featuredNews),
      body: normalizeBlocks(page.body),
      seo: normalizeSeo(page.seo, page.title, page.summary),
    }
  }

  return {
    settings: normalizeSettings(result.settings),
    home: normalizeHome(pages.home),
    pages,
    newsPosts: normalizeNewsPosts(result.newsPosts),
    projects: normalizeProjects(result.projects),
    galleryAlbums: normalizeAlbums(result.galleryAlbums),
    videos: normalizeVideos(result.videos),
    people: normalizePeople(result.people),
  }
}

function normalizeSettings(settings: Partial<SiteContent['settings']> | undefined) {
  return {
    ...seedContent.settings,
    ...settings,
    logo: normalizeImage(settings?.logo),
    favicon: normalizeImage(settings?.favicon),
    navigationLinks: normalizeLinks(
      settings?.navigationLinks,
      seedContent.settings.navigationLinks,
    ),
    supportCta: normalizeLink(settings?.supportCta, seedContent.settings.supportCta),
    footerLinks: normalizeLinks(
      settings?.footerLinks,
      seedContent.settings.footerLinks,
    ),
    socialLinks: settings?.socialLinks ?? seedContent.settings.socialLinks,
    donationDetails: settings?.donationDetails ?? seedContent.settings.donationDetails,
    defaultSeo: normalizeSeo(
      settings?.defaultSeo,
      seedContent.settings.defaultSeo.title,
      seedContent.settings.defaultSeo.description,
    ),
  }
}

function normalizeHome(homePage: PageContent): SiteContent['home'] {
  return {
    ...seedContent.home,
    title: homePage.title || seedContent.home.title,
    summary: homePage.summary || seedContent.home.summary,
    primaryCta: normalizeLink(homePage.primaryCta, seedContent.home.primaryCta),
    secondaryCta: normalizeLink(homePage.secondaryCta, seedContent.home.secondaryCta),
    proofPoints:
      normalizeProofPoints(homePage.proofPoints) ?? seedContent.home.proofPoints,
    featuredProjects:
      normalizeSlugList(homePage.featuredProjects) ?? seedContent.home.featuredProjects,
    featuredNews:
      normalizeSlugList(homePage.featuredNews) ?? seedContent.home.featuredNews,
    seo: homePage.seo ?? seedContent.home.seo,
  }
}

function normalizeNewsPosts(posts: Array<Partial<NewsPost>> | undefined) {
  const normalized = (posts ?? [])
    .filter((post) => post.title && post.slug && post.summary && post.publishedAt)
    .map<NewsPost>((post) => ({
      title: post.title!,
      slug: post.slug!,
      summary: post.summary!,
      coverImage: normalizeImage(post.coverImage),
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
      coverImage: normalizeImage(project.coverImage),
      href: `/proekty/${project.slug!}/`,
      body: normalizeBlocks(project.body),
      gallery: normalizeImages(project.gallery),
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
      coverImage: normalizeImage(album.coverImage),
      body: normalizeBlocks(album.body),
      photos: normalizeImages(album.photos),
    }))

  return normalized.length > 0 ? normalized : seedContent.galleryAlbums
}

function normalizeVideos(videos: Array<Partial<VideoItem>> | undefined) {
  const normalized = (videos ?? [])
    .filter((video) => video.title && (video.sourceUrl || video.uploadedVideo?.url))
    .map<VideoItem>((video) => {
      const slug = video.slug ?? slugify(video.title!)
      const sourceUrl =
        typeof video.sourceUrl === 'string' && video.sourceUrl
          ? video.sourceUrl
          : undefined

      return {
        title: video.title!,
        slug,
        summary: video.summary ?? 'Відеоматеріал організації.',
        publishedAt: video.publishedAt ?? '',
        date: video.publishedAt?.slice(0, 10),
        href: `/video/#${slug}`,
        sourceUrl,
        uploadedVideo: normalizeVideoAsset(video.uploadedVideo),
        thumbnail: normalizeImage(video.thumbnail),
      }
    })

  return normalized.length > 0 ? normalized : seedContent.videos
}

function normalizePeople(people: Array<Partial<Person>> | undefined) {
  return (people ?? [])
    .filter((person) => person.name)
    .map<Person>((person) => ({
      name: person.name!,
      role: person.role,
      photo: normalizeImage(person.photo),
      bio: normalizeBlocks(person.bio),
    }))
}

function normalizeLinks(value: unknown, fallback: LinkItem[]) {
  if (!Array.isArray(value)) {
    return fallback
  }

  const links = value.flatMap((item) => {
    const link = normalizeLink(item)

    return link ? [link] : []
  })

  return links.length > 0 ? links : fallback
}

function normalizeLink(value: unknown, fallback: LinkItem): LinkItem
function normalizeLink(value: unknown, fallback?: LinkItem): LinkItem | undefined
function normalizeLink(value: unknown, fallback?: LinkItem) {
  if (
    isRecord(value) &&
    typeof value.label === 'string' &&
    typeof value.href === 'string' &&
    value.label &&
    value.href
  ) {
    return {
      label: value.label,
      href: value.href,
    }
  }

  return fallback
}

function normalizeProofPoints(value: unknown) {
  if (!Array.isArray(value)) {
    return
  }

  const points = value.flatMap((item) => {
    if (
      isRecord(item) &&
      typeof item.label === 'string' &&
      typeof item.value === 'string' &&
      item.label &&
      item.value
    ) {
      return [
        {
          label: item.label,
          value: item.value,
        },
      ]
    }

    return []
  })

  if (points.length > 0) {
    return points
  }
}

function normalizeSlugList(value: unknown) {
  if (!Array.isArray(value)) {
    return
  }

  const slugs = value.filter(
    (item): item is string => typeof item === 'string' && item.length > 0,
  )

  if (slugs.length > 0) {
    return slugs
  }
}

function normalizeSeo(
  seo: Partial<SeoFields> | undefined,
  fallbackTitle: string,
  fallbackDescription: string,
): SeoFields {
  return {
    title: seo?.title ?? fallbackTitle,
    description: seo?.description ?? fallbackDescription,
    image: normalizeImage(seo?.image),
  }
}

function normalizeBlocks(value: unknown): ContentBlock[] {
  if (!Array.isArray(value)) {
    return []
  }

  const blocks: ContentBlock[] = []
  let pendingList:
    | { style: 'bullet' | 'number'; items: Array<string | RichTextInline[]> }
    | undefined

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

    const image = normalizeImage(block)

    if (block._type === 'imageWithAlt' && image) {
      flushList()
      blocks.push({
        type: 'image',
        ...image,
      })
      continue
    }

    if (block._type !== 'block') {
      continue
    }

    const children = inlineChildren(block.children, block.markDefs)
    const text = inlinePlainText(children)

    if (!text) {
      continue
    }

    if (block.listItem === 'bullet' || block.listItem === 'number') {
      const style = block.listItem

      if (pendingList?.style !== style) {
        flushList()
        pendingList = { style, items: [] }
      }

      pendingList.items.push(children.length > 0 ? children : text)
      continue
    }

    flushList()

    if (block.style === 'h2' || block.style === 'h3') {
      blocks.push({
        type: 'heading',
        level: block.style === 'h2' ? 2 : 3,
        text,
        children,
      })
    } else if (block.style === 'blockquote') {
      blocks.push({
        type: 'quote',
        text,
        children,
      })
    } else {
      blocks.push({
        type: 'paragraph',
        text,
        children,
      })
    }
  }

  flushList()

  return blocks
}

function normalizeImages(value: unknown): ImageAttachment[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item) => {
    const image = normalizeImage(item)

    return image ? [image] : []
  })
}

function normalizeImage(value: unknown): ImageAttachment | undefined {
  if (!isRecord(value) || typeof value.url !== 'string') {
    return undefined
  }

  return {
    key: typeof value._key === 'string' ? value._key : undefined,
    url: value.url,
    alt: typeof value.alt === 'string' ? value.alt : undefined,
    caption: typeof value.caption === 'string' ? value.caption : undefined,
    decorative: value.decorative === true,
  }
}

function normalizeVideoAsset(value: unknown): VideoAsset | undefined {
  if (!isRecord(value) || typeof value.url !== 'string') {
    return undefined
  }

  return {
    url: value.url,
    mimeType: typeof value.mimeType === 'string' ? value.mimeType : undefined,
    filename:
      typeof value.originalFilename === 'string' ? value.originalFilename : undefined,
  }
}

function inlineChildren(
  childrenValue: unknown,
  markDefsValue: unknown,
): RichTextInline[] {
  if (!Array.isArray(childrenValue)) {
    return []
  }

  const linksByKey = new Map<string, string>()

  if (Array.isArray(markDefsValue)) {
    for (const markDef of markDefsValue) {
      if (
        isRecord(markDef) &&
        typeof markDef._key === 'string' &&
        markDef._type === 'link' &&
        typeof markDef.href === 'string'
      ) {
        linksByKey.set(markDef._key, markDef.href)
      }
    }
  }

  return childrenValue.flatMap((child) => {
    if (!isRecord(child) || typeof child.text !== 'string') {
      return []
    }

    const marks = Array.isArray(child.marks)
      ? child.marks.filter((mark): mark is string => typeof mark === 'string')
      : []
    const decorators = marks.filter(
      (mark): mark is 'strong' | 'em' => mark === 'strong' || mark === 'em',
    )
    const href = marks.map((mark) => linksByKey.get(mark)).find(Boolean)

    return [
      {
        key: typeof child._key === 'string' ? child._key : undefined,
        text: child.text,
        marks: decorators.length > 0 ? decorators : undefined,
        href,
      },
    ]
  })
}

function inlinePlainText(children: RichTextInline[]) {
  return children
    .map((child) => child.text)
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
