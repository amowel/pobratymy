import { createFileRoute, notFound } from '@tanstack/react-router'
import { MissingArticle } from '../components/ArticlePage'
import { AttachmentGrid, AttachmentImage } from '../components/AttachmentImage'
import { RichText } from '../components/RichText'
import { getGalleryAlbum } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/galereia/$slug')({
  loader: async ({ params }) => {
    const album = await getGalleryAlbum({ data: params.slug })

    if (!album) {
      throw notFound()
    }

    return album
  },
  head: ({ loaderData }) => ({
    meta: seoMeta(
      loaderData
        ? fallbackSeo(loaderData.title, loaderData.summary)
        : fallbackSeo('Галерея', 'Фотоальбом ще не опублікований.'),
    ),
  }),
  notFoundComponent: () => <MissingArticle label="Фотоальбом" />,
  component: GalleryDetail,
})

function GalleryDetail() {
  const album = Route.useLoaderData()

  return (
    <main className="page-wrap">
      <article className="content-shell content-shell-wide">
        <p className="eyebrow">Галерея</p>
        <h1>{album.title}</h1>
        <p className="lede">{album.summary}</p>
        {album.coverImage ? (
          <AttachmentImage
            image={album.coverImage}
            className="cover-image"
            loading="eager"
          />
        ) : null}
        <RichText blocks={album.body} />
        <AttachmentGrid images={album.photos} label="Фотоальбом" />
      </article>
    </main>
  )
}
