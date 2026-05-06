import type { CollectionItem } from '../content/types'

interface CollectionPageProps {
  eyebrow: string
  title: string
  summary: string
  items: CollectionItem[]
  emptyLabel?: string
}

export function CollectionPage({
  eyebrow,
  title,
  summary,
  items,
  emptyLabel = 'Матеріали з’являться після наповнення CMS.',
}: CollectionPageProps) {
  return (
    <main className="page-wrap">
      <section className="content-shell content-shell-wide">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lede">{summary}</p>

        {items.length > 0 ? (
          <div className="card-grid">
            {items.map((item) => (
              <article key={item.href} className="content-card">
                {item.date ? <p className="meta">{formatDate(item.date)}</p> : null}
                <h2>
                  <a href={item.href}>{item.title}</a>
                </h2>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-state">{emptyLabel}</p>
        )}
      </section>
    </main>
  )
}

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
