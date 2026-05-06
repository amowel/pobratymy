import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '../components/PagePlaceholder'

export const Route = createFileRoute('/pro-nas')({
  component: About,
})

function About() {
  return (
    <PagePlaceholder
      title="Про нас"
      description="Місія, історія та напрямки роботи організації будуть редагуватися як структурований контент."
    />
  )
}
