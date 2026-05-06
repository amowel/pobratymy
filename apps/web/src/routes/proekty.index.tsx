import { createFileRoute } from '@tanstack/react-router'
import { CollectionPage } from '../components/CollectionPage'
import { getSiteContent } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/proekty/')({
  loader: () => getSiteContent(),
  head: () => ({
    meta: seoMeta(
      fallbackSeo(
        'Проєкти',
        'Проєкти, ініціативи і напрями роботи ГО «Побратими разом».',
      ),
    ),
  }),
  component: ProjectsIndex,
})

function ProjectsIndex() {
  const content = Route.useLoaderData()

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
