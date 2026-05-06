import { createFileRoute, notFound } from '@tanstack/react-router'
import { MissingArticle, SimpleDetailPage } from '../components/ArticlePage'
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
    <SimpleDetailPage eyebrow="Галерея" title={album.title} summary={album.summary} />
  )
}
