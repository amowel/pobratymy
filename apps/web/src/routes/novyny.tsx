import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router'
import { CollectionPage } from '../components/CollectionPage'
import { getSiteContent } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/novyny')({
  loader: () => getSiteContent(),
  head: () => ({
    meta: seoMeta(
      fallbackSeo('Новини', 'Новини, оновлення і короткі звіти ГО «Побратими разом».'),
    ),
  }),
  component: News,
})

function News() {
  const content = Route.useLoaderData()
  const location = useLocation()

  if (!isCollectionPath(location.pathname, '/novyny/')) {
    return <Outlet />
  }

  return (
    <CollectionPage
      eyebrow="Новини"
      title="Оновлення організації"
      summary="Публічні новини і короткі звіти, які будуть отримуватися з Sanity під час білду."
      items={content.newsPosts}
      detailRoute="/novyny/$slug/"
    />
  )
}

function isCollectionPath(pathname: string, collectionPath: string) {
  return pathname === collectionPath || `${pathname}/` === collectionPath
}
