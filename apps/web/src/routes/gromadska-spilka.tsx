import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '../components/ContentPage'
import { getPageContent } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/gromadska-spilka')({
  loader: () => getPageContent('civicUnion'),
  head: ({ loaderData }) => ({
    meta: seoMeta(
      loaderData?.seo ??
        fallbackSeo('Громадська спілка', 'Інформація про громадську спілку.'),
    ),
  }),
  component: CivicUnion,
})

function CivicUnion() {
  const page = Route.useLoaderData()

  return <ContentPage page={page} />
}
