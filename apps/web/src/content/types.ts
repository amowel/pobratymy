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
}

export interface SocialLink {
  label: string
  url: string
}

export interface DonationDetail {
  label: string
  value: string
}

export interface SiteSettings {
  title: string
  description: string
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
    }
  | {
      type: 'paragraph'
      text: string
    }
  | {
      type: 'list'
      style: 'bullet' | 'number'
      items: string[]
    }
  | {
      type: 'quote'
      text: string
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
  body: ContentBlock[]
  seo: SeoFields
}

export interface HomeContent {
  eyebrow: string
  title: string
  summary: string
  primaryCta: {
    label: string
    href: string
  }
  secondaryCta: {
    label: string
    href: string
  }
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
}

export interface NewsPost extends CollectionItem {
  publishedAt: string
  body: ContentBlock[]
  seo: SeoFields
}

export interface Project extends CollectionItem {
  status: ProjectStatus
  body: ContentBlock[]
  seo: SeoFields
}

export interface GalleryAlbum extends CollectionItem {
  date: string
}

export interface VideoItem extends CollectionItem {
  publishedAt: string
  sourceUrl: string
}

export interface SiteContent {
  settings: SiteSettings
  home: HomeContent
  pages: Record<RouteId, PageContent>
  newsPosts: NewsPost[]
  projects: Project[]
  galleryAlbums: GalleryAlbum[]
  videos: VideoItem[]
}
