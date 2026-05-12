export type RouteId =
  | 'home'
  | 'aboutUs'
  | 'about'
  | 'contacts'
  | 'help'
  | 'civicUnion'
  | 'mediaInfo'

export type ProjectStatus = 'planned' | 'active' | 'completed' | 'archived'

export interface SeoFields {
  title: string
  description: string
  image?: ImageAttachment
}

export interface ImageAttachment {
  key?: string
  url: string
  alt?: string
  caption?: string
  decorative?: boolean
}

export interface SocialLink {
  label: string
  url: string
}

export interface DonationDetail {
  label: string
  value: string
}

export interface LinkItem {
  label: string
  href: string
}

export interface RichTextInline {
  key?: string
  text: string
  marks?: Array<'strong' | 'em'>
  href?: string
}

export interface SiteSettings {
  title: string
  description: string
  logo?: ImageAttachment
  favicon?: ImageAttachment
  navigationLinks: LinkItem[]
  supportCta: LinkItem
  footerLinks: LinkItem[]
  phone?: string
  email?: string
  address?: string
  socialLinks: SocialLink[]
  donationDetails: DonationDetail[]
  defaultSeo: SeoFields
}

export type ContentBlock =
  | {
      type: 'heading'
      level: 2 | 3
      text: string
      children?: RichTextInline[]
    }
  | {
      type: 'paragraph'
      text: string
      children?: RichTextInline[]
    }
  | {
      type: 'list'
      style: 'bullet' | 'number'
      items: Array<string | RichTextInline[]>
    }
  | {
      type: 'quote'
      text: string
      children?: RichTextInline[]
    }
  | {
      type: 'callout'
      tone: 'info' | 'important'
      text: string
    }
  | {
      type: 'image'
      url: string
      alt?: string
      caption?: string
      decorative?: boolean
    }

export interface PageContent {
  routeId: RouteId
  path: string
  eyebrow: string
  title: string
  summary: string
  coverImage?: ImageAttachment
  primaryCta?: LinkItem
  secondaryCta?: LinkItem
  proofPoints?: Array<{
    label: string
    value: string
  }>
  featuredProjects?: string[]
  featuredNews?: string[]
  body: ContentBlock[]
  seo: SeoFields
}

export interface HomeContent {
  eyebrow: string
  title: string
  summary: string
  primaryCta: LinkItem
  secondaryCta: LinkItem
  proofPoints: Array<{
    label: string
    value: string
  }>
  featuredProjects: string[]
  featuredNews: string[]
  seo: SeoFields
}

export interface CollectionItem {
  title: string
  slug: string
  summary: string
  date?: string
  href: string
  coverImage?: ImageAttachment
}

export interface NewsPost extends CollectionItem {
  publishedAt: string
  body: ContentBlock[]
  seo: SeoFields
}

export interface Project extends CollectionItem {
  status: ProjectStatus
  body: ContentBlock[]
  gallery: ImageAttachment[]
  seo: SeoFields
}

export interface GalleryAlbum extends CollectionItem {
  date: string
  body: ContentBlock[]
  photos: ImageAttachment[]
}

export interface VideoItem extends CollectionItem {
  publishedAt: string
  sourceUrl?: string
  uploadedVideo?: VideoAsset
  thumbnail?: ImageAttachment
}

export interface VideoAsset {
  url: string
  mimeType?: string
  filename?: string
}

export interface Person {
  name: string
  role?: string
  photo?: ImageAttachment
  bio: ContentBlock[]
}

export interface SiteContent {
  settings: SiteSettings
  home: HomeContent
  pages: Record<RouteId, PageContent>
  newsPosts: NewsPost[]
  projects: Project[]
  galleryAlbums: GalleryAlbum[]
  videos: VideoItem[]
  people: Person[]
}
