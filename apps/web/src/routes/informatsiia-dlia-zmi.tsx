import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '../components/ContentPage'
import { getPageContent } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/informatsiia-dlia-zmi')({
  loader: () => getPageContent({ data: 'mediaInfo' }),
  head: ({ loaderData }) => ({
    meta: seoMeta(
      loaderData?.seo ??
        fallbackSeo('Інформація для ЗМІ', 'Довідкова інформація для медіа.'),
    ),
  }),
  component: MediaInfo,
})

function MediaInfo() {
  const page = Route.useLoaderData()

  return <ContentPage page={page} />
}
