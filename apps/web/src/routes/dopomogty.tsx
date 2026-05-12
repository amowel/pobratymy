import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '../components/ContentPage'
import { getSiteContent } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/dopomogty')({
  loader: () => getSiteContent(),
  head: ({ loaderData }) => ({
    meta: seoMeta(
      loaderData?.pages.help.seo ??
        fallbackSeo('Як допомогти', 'Способи підтримати ГО «Побратими разом».'),
    ),
  }),
  component: Help,
})

function Help() {
  const content = Route.useLoaderData()

  return <ContentPage page={content.pages.help} settings={content.settings} />
}
