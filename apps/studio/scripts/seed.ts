import { getCliClient } from 'sanity/cli'
import { seedContent } from '../../web/src/content/seed'
import type {
  ContentBlock,
  GalleryAlbum,
  NewsPost,
  Project,
} from '../../web/src/content/types'

const client = getCliClient({ apiVersion: '2026-05-06' })

interface SeedDocument {
  _id: string
  _type: string
  [key: string]: unknown
}

interface PortableTextNode {
  _key: string
  _type: string
  [key: string]: unknown
}

const legacySeedIds = [
  'newsPost-site-rebuild-started',
  'newsPost-content-migration',
  'project-veteran-support',
  'project-partner-aid',
  'project-community-aid',
  'galleryAlbum-activity-photos',
  'video-organization-video',
]

const documents: SeedDocument[] = [
  siteSettingsDocument(),
  ...Object.values(seedContent.pages).map((page) => ({
    _id: `page-${page.routeId}`,
    _type: 'page',
    routeId: page.routeId,
    title: page.title,
    summary: page.summary,
    body: toPortableText(page.body),
    seo: page.seo,
  })),
  ...seedContent.newsPosts.map(newsPostDocument),
  ...seedContent.projects.map(projectDocument),
  ...seedContent.galleryAlbums.map(galleryAlbumDocument),
  ...seedContent.videos.map((video) => ({
    _id: `video-${video.slug}`,
    _type: 'video',
    title: video.title,
    slug: slugField(video.slug),
    publishedAt: video.publishedAt,
    sourceUrl: video.sourceUrl,
    description: video.summary,
  })),
]

let transaction = client.transaction()

for (const id of legacySeedIds) {
  transaction = transaction.delete(id)
}

for (const document of documents) {
  transaction = transaction.createOrReplace(document)
}

await transaction.commit({ visibility: 'sync' })

console.log(`Seeded ${documents.length} Sanity documents.`)

function siteSettingsDocument(): SeedDocument {
  return {
    _id: 'siteSettings',
    _type: 'siteSettings',
    title: seedContent.settings.title,
    defaultSeo: seedContent.settings.defaultSeo,
    phone: seedContent.settings.phone,
    email: seedContent.settings.email,
    address: seedContent.settings.address,
    socialLinks: seedContent.settings.socialLinks.map((link) => ({
      _key: key(`social-${link.label}`),
      label: link.label,
      url: link.url,
    })),
    donationDetails: seedContent.settings.donationDetails.map((detail) => ({
      _key: key(`donation-${detail.label}`),
      label: detail.label,
      value: detail.value,
    })),
  }
}

function newsPostDocument(post: NewsPost): SeedDocument {
  return {
    _id: `newsPost-${post.slug}`,
    _type: 'newsPost',
    title: post.title,
    slug: slugField(post.slug),
    publishedAt: post.publishedAt,
    summary: post.summary,
    body: toPortableText(post.body),
    seo: post.seo,
  }
}

function projectDocument(project: Project): SeedDocument {
  return {
    _id: `project-${project.slug}`,
    _type: 'project',
    title: project.title,
    slug: slugField(project.slug),
    status: project.status,
    summary: project.summary,
    body: toPortableText(project.body),
    seo: project.seo,
  }
}

function galleryAlbumDocument(album: GalleryAlbum): SeedDocument {
  return {
    _id: `galleryAlbum-${album.slug}`,
    _type: 'galleryAlbum',
    title: album.title,
    slug: slugField(album.slug),
    date: album.date,
    description: toPortableText([
      {
        type: 'paragraph',
        text: album.summary,
      },
    ]),
  }
}

function slugField(slug: string) {
  return {
    _type: 'slug',
    current: slug,
  }
}

function toPortableText(blocks: ContentBlock[]): PortableTextNode[] {
  return blocks.flatMap<PortableTextNode>((block, index) => {
    if (block.type === 'heading') {
      return [
        textBlock({
          seed: `heading-${index}-${block.text}`,
          style: block.level === 2 ? 'h2' : 'h3',
          text: block.text,
        }),
      ]
    }

    if (block.type === 'paragraph') {
      return [
        textBlock({
          seed: `paragraph-${index}-${block.text}`,
          style: 'normal',
          text: block.text,
        }),
      ]
    }

    if (block.type === 'quote') {
      return [
        textBlock({
          seed: `quote-${index}-${block.text}`,
          style: 'blockquote',
          text: block.text,
        }),
      ]
    }

    if (block.type === 'list') {
      return block.items.map((item, itemIndex) =>
        textBlock({
          seed: `list-${index}-${itemIndex}-${item}`,
          style: 'normal',
          text: item,
          listItem: block.style,
        }),
      )
    }

    if (block.type === 'callout') {
      return [
        {
          _type: 'callout',
          _key: key(`callout-${index}-${block.text}`),
          tone: block.tone,
          text: block.text,
        },
      ]
    }

    return []
  })
}

function textBlock({
  seed,
  style,
  text,
  listItem,
}: {
  seed: string
  style: 'normal' | 'h2' | 'h3' | 'blockquote'
  text: string
  listItem?: 'bullet' | 'number'
}): PortableTextNode {
  return {
    _type: 'block',
    _key: key(seed),
    style,
    ...(listItem ? { listItem, level: 1 } : {}),
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: key(`${seed}-span`),
        text,
        marks: [],
      },
    ],
  }
}

function key(value: string) {
  let hash = 0

  for (const character of value) {
    hash = Math.trunc(hash * 31 + (character.codePointAt(0) ?? 0)) % 2_147_483_647
  }

  return `k${hash.toString(36)}`
}
