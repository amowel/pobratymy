import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../components/HomePage'
import { getSiteContent } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/')({
  loader: () => getSiteContent(),
  head: ({ loaderData }) => ({
    meta: seoMeta(
      loaderData?.home.seo ??
        fallbackSeo(
          'Побратими разом',
          'Громадська організація ветеранів та волонтерів в Україні.',
        ),
    ),
  }),
  component: Home,
})

function Home() {
  const content = Route.useLoaderData()

  return (
    <HomePage
      home={content.home}
      projects={content.projects}
      newsPosts={content.newsPosts}
    />
  )
}
