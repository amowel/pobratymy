import type { NewsPost, Project } from '../content/types'
import { RichText } from './RichText'

interface ArticlePageProps {
  eyebrow: string
  item: NewsPost | Project
}

export function ArticlePage({ eyebrow, item }: ArticlePageProps) {
  return (
    <main className="page-wrap">
      <article className="content-shell content-shell-wide">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{item.title}</h1>
        <p className="lede">{item.summary}</p>
        <RichText blocks={item.body} />
      </article>
    </main>
  )
}

export function MissingArticle({ label }: { label: string }) {
  return (
    <main className="page-wrap">
      <section className="content-shell">
        <p className="eyebrow">404</p>
        <h1>{label} не знайдено</h1>
        <p className="lede">Матеріал відсутній або ще не опублікований у CMS.</p>
      </section>
    </main>
  )
}

interface SimpleDetailPageProps {
  eyebrow: string
  title: string
  summary: string
}

export function SimpleDetailPage({ eyebrow, title, summary }: SimpleDetailPageProps) {
  return (
    <main className="page-wrap">
      <article className="content-shell content-shell-wide">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lede">{summary}</p>
      </article>
    </main>
  )
}
