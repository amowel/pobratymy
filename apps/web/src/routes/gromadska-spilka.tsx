import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '../components/PagePlaceholder'

export const Route = createFileRoute('/gromadska-spilka')({
  component: CivicUnion,
})

function CivicUnion() {
  return (
    <PagePlaceholder
      title="Громадська спілка"
      description="Сторінка збережена у поточній структурі URL і буде наповнюватися через CMS."
    />
  )
}
