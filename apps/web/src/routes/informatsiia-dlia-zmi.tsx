import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '../components/PagePlaceholder'

export const Route = createFileRoute('/informatsiia-dlia-zmi')({
  component: MediaInfo,
})

function MediaInfo() {
  return (
    <PagePlaceholder
      title="Інформація для ЗМІ"
      description="Матеріали для медіа, контакти та довідкова інформація будуть структуровані в Sanity."
    />
  )
}
