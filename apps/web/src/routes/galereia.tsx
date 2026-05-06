import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router'
import { CollectionPage } from '../components/CollectionPage'
import { getSiteContent } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/galereia')({
  loader: () => getSiteContent(),
  head: () => ({
    meta: seoMeta(
      fallbackSeo(
        'Галерея',
        'Фотоальбоми ГО «Побратими разом» з реальними матеріалами діяльності.',
      ),
    ),
  }),
  component: Gallery,
})

function Gallery() {
  const content = Route.useLoaderData()
  const location = useLocation()

  if (!isCollectionPath(location.pathname, '/galereia/')) {
    return <Outlet />
  }

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

function isCollectionPath(pathname: string, collectionPath: string) {
  return pathname === collectionPath || `${pathname}/` === collectionPath
}
