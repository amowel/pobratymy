import type { PageContent } from '../content/types'
import { RichText } from './RichText'

interface ContentPageProps {
  page: PageContent
}

export function ContentPage({ page }: ContentPageProps) {
  return (
    <main className="page-wrap">
      <article className="content-shell content-shell-wide">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p className="lede">{page.summary}</p>
        <RichText blocks={page.body} />
      </article>
    </main>
  )
}
