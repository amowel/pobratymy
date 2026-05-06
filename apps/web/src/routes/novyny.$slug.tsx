import { createFileRoute } from '@tanstack/react-router'
import { ArticlePage, MissingArticle } from '../components/ArticlePage'
import { getNewsPost } from '../content/sanity'
import { fallbackSeo, seoMeta } from '../content/seo'

export const Route = createFileRoute('/novyny/$slug')({
  loader: ({ params }) => getNewsPost(params.slug),
  head: ({ loaderData }) => ({
    meta: seoMeta(
      loaderData?.seo ??
        fallbackSeo('Новина', 'Новина ГО «Побратими разом» ще не опублікована.'),
    ),
  }),
  component: NewsDetail,
})

function NewsDetail() {
  const post = Route.useLoaderData()

  if (!post) {
    return <MissingArticle label="Новину" />
  }

  return <ArticlePage eyebrow="Новини" item={post} />
}
