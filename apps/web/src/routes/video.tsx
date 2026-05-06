import { createFileRoute } from '@tanstack/react-router'
import { VideoGalleryPage } from '../components/VideoGalleryPage'
import { getSiteContent } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/video')({
  loader: () => getSiteContent(),
  head: () => ({
    meta: seoMeta(
      fallbackSeo(
        'Відео',
        'Відеоматеріали ГО «Побратими разом» із зовнішніх платформ.',
      ),
    ),
  }),
  component: Video,
})

function Video() {
  const content = Route.useLoaderData()

  return (
    <VideoGalleryPage
      eyebrow="Відео"
      title="Відеоматеріали"
      summary="Зовнішні YouTube або Vimeo-посилання, структуровані в CMS без власного відеохостингу."
      videos={content.videos}
    />
  )
}
