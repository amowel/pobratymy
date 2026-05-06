import { createFileRoute, notFound } from '@tanstack/react-router'
import { ArticlePage, MissingArticle } from '../components/ArticlePage'
import { getNewsPost } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/novyny/$slug')({
  loader: async ({ params }) => {
    const post = await getNewsPost({ data: params.slug })

    if (!post) {
      throw notFound()
    }

    return post
  },
  head: ({ loaderData }) => ({
    meta: seoMeta(
      loaderData?.seo ??
        fallbackSeo('Новина', 'Новина ГО «Побратими разом» ще не опублікована.'),
    ),
  }),
  notFoundComponent: () => <MissingArticle label="Новину" />,
  component: NewsDetail,
})

function NewsDetail() {
  const post = Route.useLoaderData()

  return <ArticlePage eyebrow="Новини" item={post} />
}
