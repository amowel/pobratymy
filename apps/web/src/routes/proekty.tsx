import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router'
import { CollectionPage } from '../components/CollectionPage'
import { getSiteContent } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/proekty')({
  loader: () => getSiteContent(),
  head: () => ({
    meta: seoMeta(
      fallbackSeo(
        'Проєкти',
        'Проєкти, ініціативи і напрями роботи ГО «Побратими разом».',
      ),
    ),
  }),
  component: Projects,
})

function Projects() {
  const content = Route.useLoaderData()
  const location = useLocation()

  if (!isCollectionPath(location.pathname, '/proekty/')) {
    return <Outlet />
  }

  return (
    <CollectionPage
      eyebrow="Проєкти"
      title="Ініціативи та напрями роботи"
      summary="Проєкти мають показувати статус, контекст і зрозумілий спосіб підтримки."
      items={content.projects}
      detailRoute="/proekty/$slug/"
    />
  )
}

function isCollectionPath(pathname: string, collectionPath: string) {
  return pathname === collectionPath || `${pathname}/` === collectionPath
}
