import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '../components/PagePlaceholder'

export const Route = createFileRoute('/novyny')({
  component: News,
})

function News() {
  return (
    <PagePlaceholder
      title="Новини"
      description="Список новин буде отримувати опубліковані записи з Sanity під час статичного білду."
    />
  )
}
