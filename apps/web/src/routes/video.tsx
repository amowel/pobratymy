import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '../components/PagePlaceholder'

export const Route = createFileRoute('/video')({
  component: Video,
})

function Video() {
  return (
    <PagePlaceholder
      title="Відео"
      description="Відеоматеріали будуть додаватися як зовнішні YouTube/Vimeo-посилання в CMS."
    />
  )
}
