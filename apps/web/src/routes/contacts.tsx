import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '../components/PagePlaceholder'

export const Route = createFileRoute('/contacts')({
  component: Contacts,
})

function Contacts() {
  return (
    <PagePlaceholder
      title="Контакти"
      description="Контактні дані, соціальні посилання та канали зв'язку будуть редагуватися в Sanity."
    />
  )
}
