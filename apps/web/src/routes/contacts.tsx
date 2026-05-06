import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '../components/ContentPage'
import { getPageContent } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/contacts')({
  loader: () => getPageContent({ data: 'contacts' }),
  head: ({ loaderData }) => ({
    meta: seoMeta(
      loaderData?.seo ??
        fallbackSeo('Контакти', 'Контактні канали ГО «Побратими разом».'),
    ),
  }),
  component: Contacts,
})

function Contacts() {
  const page = Route.useLoaderData()

  return <ContentPage page={page} />
}
