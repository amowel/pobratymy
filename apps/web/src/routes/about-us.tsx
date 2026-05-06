import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '../components/ContentPage'
import { getPageContent } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/about-us')({
  loader: () => getPageContent({ data: 'aboutUs' }),
  head: ({ loaderData }) => ({
    meta: seoMeta(
      loaderData?.seo ?? fallbackSeo('Про організацію', 'Інформація про організацію.'),
    ),
  }),
  component: AboutUs,
})

function AboutUs() {
  const page = Route.useLoaderData()

  return <ContentPage page={page} />
}
