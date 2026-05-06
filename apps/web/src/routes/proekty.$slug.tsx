import { createFileRoute } from '@tanstack/react-router'
import { ArticlePage, MissingArticle } from '../components/ArticlePage'
import { getProject } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/proekty/$slug')({
  loader: ({ params }) => getProject(params.slug),
  head: ({ loaderData }) => ({
    meta: seoMeta(
      loaderData?.seo ??
        fallbackSeo('Проєкт', 'Проєкт ГО «Побратими разом» ще не опублікований.'),
    ),
  }),
  component: ProjectDetail,
})

function ProjectDetail() {
  const project = Route.useLoaderData()

  if (!project) {
    return <MissingArticle label="Проєкт" />
  }

  return <ArticlePage eyebrow="Проєкти" item={project} />
}
