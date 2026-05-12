import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '../components/ContentPage'
import { getSiteContent } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/about-us')({
  loader: () => getSiteContent(),
  head: ({ loaderData }) => ({
    meta: seoMeta(
      loaderData?.pages.aboutUs.seo ??
        fallbackSeo('Про організацію', 'Інформація про організацію.'),
    ),
  }),
  component: AboutUs,
})

function AboutUs() {
  const content = Route.useLoaderData()

  return <ContentPage page={content.pages.aboutUs} people={content.people} />
}
