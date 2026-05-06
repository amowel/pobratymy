import { createFileRoute } from '@tanstack/react-router'
import { MissingArticle, SimpleDetailPage } from '../components/ArticlePage'
import { getGalleryAlbum } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/galereia/$slug')({
  loader: ({ params }) => getGalleryAlbum(params.slug),
  head: ({ loaderData }) => ({
    meta: seoMeta(
      loaderData
        ? fallbackSeo(loaderData.title, loaderData.summary)
        : fallbackSeo('Галерея', 'Фотоальбом ще не опублікований.'),
    ),
  }),
  component: GalleryDetail,
})

function GalleryDetail() {
  const album = Route.useLoaderData()

  if (!album) {
    return <MissingArticle label="Фотоальбом" />
  }

  return (
    <SimpleDetailPage eyebrow="Галерея" title={album.title} summary={album.summary} />
  )
}
