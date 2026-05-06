import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '../components/PagePlaceholder'

export const Route = createFileRoute('/proekty')({
  component: Projects,
})

function Projects() {
  return (
    <PagePlaceholder
      title="Проєкти"
      description="Стабільні ініціативи, їхній статус, результати та медіа будуть керуватися через Sanity."
    />
  )
}
