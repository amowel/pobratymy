import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '../components/ContentPage'
import { getSiteContent } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/pro-nas')({
  loader: () => getSiteContent(),
  head: ({ loaderData }) => ({
    meta: seoMeta(
      loaderData?.pages.about.seo ??
        fallbackSeo(
          'Про нас',
          'Місія, принципи та напрями роботи ГО «Побратими разом».',
        ),
    ),
  }),
  component: About,
})

function About() {
  const content = Route.useLoaderData()

  return <ContentPage page={content.pages.about} people={content.people} />
}
