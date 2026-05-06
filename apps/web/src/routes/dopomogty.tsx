import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '../components/PagePlaceholder'

export const Route = createFileRoute('/dopomogty')({
  component: Help,
})

function Help() {
  return (
    <PagePlaceholder
      title="Як допомогти"
      description="Сторінка підтримки міститиме перевірені реквізити, матеріальні потреби та контакти для партнерства."
    />
  )
}
