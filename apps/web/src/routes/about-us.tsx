import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '../components/PagePlaceholder'

export const Route = createFileRoute('/about-us')({
  component: AboutUs,
})

function AboutUs() {
  return (
    <PagePlaceholder
      title="About us"
      description="Legacy route kept for the current site structure. Content will be managed in Sanity."
    />
  )
}
