import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '../components/ContentPage'
import { getPageContent } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/dopomogty')({
  loader: () => getPageContent({ data: 'help' }),
  head: ({ loaderData }) => ({
    meta: seoMeta(
      loaderData?.seo ??
        fallbackSeo('Як допомогти', 'Способи підтримати ГО «Побратими разом».'),
    ),
  }),
  component: Help,
})

function Help() {
  const page = Route.useLoaderData()

  return <ContentPage page={page} />
}
