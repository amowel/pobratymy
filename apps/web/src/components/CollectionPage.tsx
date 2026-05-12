import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import type { CollectionItem } from '../content/types'
import { ArrowUpRightIcon } from './ArrowUpRightIcon'

type DetailRoute = '/galereia/$slug/' | '/novyny/$slug/' | '/proekty/$slug/'

interface CollectionPageProps {
  eyebrow: string
  title: string
  summary: string
  items: CollectionItem[]
  detailRoute: DetailRoute
  emptyLabel?: string
}

export function CollectionPage({
  eyebrow,
  title,
  summary,
  items,
  detailRoute,
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
              <CollectionItemCard
                key={item.href}
                item={item}
                detailRoute={detailRoute}
              />
            ))}
          </div>
        ) : (
          <p className="empty-state">{emptyLabel}</p>
        )}
      </section>
    </main>
  )
}

function CollectionItemCard({
  item,
  detailRoute,
}: {
  item: CollectionItem
  detailRoute: DetailRoute
}) {
  const params = useMemo(() => ({ slug: item.slug }), [item.slug])

  return (
    <Link to={detailRoute} params={params} className="content-card card-link">
      {item.coverImage ? (
        <div className="card-cover" aria-hidden={item.coverImage.decorative}>
          <img
            src={item.coverImage.url}
            alt={item.coverImage.decorative ? '' : (item.coverImage.alt ?? '')}
            loading="lazy"
          />
        </div>
      ) : null}
      {item.date ? <p className="meta status-pill">{formatDate(item.date)}</p> : null}
      <h2>{item.title}</h2>
      <p>{item.summary}</p>
      <span className="card-affordance" aria-hidden="true">
        <ArrowUpRightIcon className="card-affordance-icon" />
      </span>
    </Link>
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
