import { createFileRoute, notFound } from '@tanstack/react-router'
import { ArticlePage, MissingArticle } from '../components/ArticlePage'
import { getProject } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/proekty/$slug')({
  loader: async ({ params }) => {
    const project = await getProject({ data: params.slug })

    if (!project) {
      throw notFound()
    }

    return project
  },
  head: ({ loaderData }) => ({
    meta: seoMeta(
      loaderData?.seo ??
        fallbackSeo('Проєкт', 'Проєкт ГО «Побратими разом» ще не опублікований.'),
    ),
  }),
  notFoundComponent: () => <MissingArticle label="Проєкт" />,
  component: ProjectDetail,
})

function ProjectDetail() {
  const project = Route.useLoaderData()

  return <ArticlePage eyebrow="Проєкти" item={project} />
}
