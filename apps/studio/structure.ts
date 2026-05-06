import {
  CogIcon,
  DocumentIcon,
  DocumentTextIcon,
  FolderIcon,
  ImagesIcon,
  PlayIcon,
  UserIcon,
} from '@sanity/icons'
import type { ComponentType } from 'react'
import type { StructureBuilder, StructureResolver } from 'sanity/structure'

interface SingletonConfig {
  icon: ComponentType
  title: string
  typeName: string
}

export const structure: StructureResolver = (builder) =>
  builder
    .list()
    .title('Pobratymy CMS')
    .items([
      singleton(builder, {
        icon: CogIcon,
        title: 'Site settings',
        typeName: 'siteSettings',
      }),
      builder.divider(),
      builder.documentTypeListItem('page').title('Pages').icon(DocumentIcon),
      builder
        .listItem()
        .title('Collections')
        .icon(FolderIcon)
        .child(
          builder
            .list()
            .title('Collections')
            .items([
              builder
                .documentTypeListItem('project')
                .title('Projects')
                .icon(FolderIcon),
              builder
                .documentTypeListItem('newsPost')
                .title('News posts')
                .icon(DocumentTextIcon),
              builder
                .documentTypeListItem('galleryAlbum')
                .title('Gallery albums')
                .icon(ImagesIcon),
              builder.documentTypeListItem('video').title('Videos').icon(PlayIcon),
            ]),
        ),
      builder.documentTypeListItem('person').title('People').icon(UserIcon),
    ])

function singleton(builder: StructureBuilder, config: SingletonConfig) {
  return builder
    .listItem()
    .title(config.title)
    .icon(config.icon)
    .child(
      builder
        .document()
        .schemaType(config.typeName)
        .documentId(config.typeName)
        .title(config.title),
    )
}
