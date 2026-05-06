import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '../components/ContentPage'
import { getPageContent } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/pro-nas')({
  loader: () => getPageContent('about'),
  head: ({ loaderData }) => ({
    meta: seoMeta(
      loaderData?.seo ??
        fallbackSeo(
          'Про нас',
          'Місія, принципи та напрями роботи ГО «Побратими разом».',
        ),
    ),
  }),
  component: About,
})

function About() {
  const page = Route.useLoaderData()

  return <ContentPage page={page} />
}
