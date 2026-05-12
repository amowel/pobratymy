import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '../components/ContentPage'
import { getSiteContent } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/contacts')({
  loader: () => getSiteContent(),
  head: ({ loaderData }) => ({
    meta: seoMeta(
      loaderData?.pages.contacts.seo ??
        fallbackSeo('Контакти', 'Контактні канали ГО «Побратими разом».'),
    ),
  }),
  component: Contacts,
})

function Contacts() {
  const content = Route.useLoaderData()

  return <ContentPage page={content.pages.contacts} settings={content.settings} />
}
