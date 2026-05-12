import { galleryAlbum } from './documents/galleryAlbum'
import { newsPost } from './documents/newsPost'
import { page } from './documents/page'
import { person } from './documents/person'
import { project } from './documents/project'
import { siteSettings } from './documents/siteSettings'
import { video } from './documents/video'
import { imageWithAlt } from './objects/imageWithAlt'
import { navLink } from './objects/navLink'
import { optionalImageWithAlt } from './objects/optionalImageWithAlt'
import { portableText } from './objects/portableText'
import { seoFields } from './objects/seoFields'
import { socialLink } from './objects/socialLink'

export const schemaTypes = [
  siteSettings,
  page,
  newsPost,
  project,
  galleryAlbum,
  video,
  person,
  imageWithAlt,
  navLink,
  optionalImageWithAlt,
  portableText,
  seoFields,
  socialLink,
]
