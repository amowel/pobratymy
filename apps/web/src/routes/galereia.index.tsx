import { createFileRoute } from '@tanstack/react-router'
import { CollectionPage } from '../components/CollectionPage'
import { getSiteContent } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/galereia/')({
  loader: () => getSiteContent(),
  head: () => ({
    meta: seoMeta(
      fallbackSeo(
        'Галерея',
        'Фотоальбоми ГО «Побратими разом» з реальними матеріалами діяльності.',
      ),
    ),
  }),
  component: GalleryIndex,
})

function GalleryIndex() {
  const content = Route.useLoaderData()

  return (
    <CollectionPage
      eyebrow="Галерея"
      title="Фото діяльності"
      summary="Фотоальбоми мають показувати реальну роботу організації і будуть наповнюватися через Sanity."
      items={content.galleryAlbums}
      detailRoute="/galereia/$slug/"
    />
  )
}
