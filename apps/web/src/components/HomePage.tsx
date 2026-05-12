import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import type { HomeContent, LinkItem, NewsPost, Project } from '../content/types'
import { ArrowUpRightIcon } from './ArrowUpRightIcon'

interface HomePageProps {
  home: HomeContent
  projects: Project[]
  newsPosts: NewsPost[]
}

export function HomePage({ home, projects, newsPosts }: HomePageProps) {
  const featuredProjects = projects.filter((project) =>
    home.featuredProjects.includes(project.slug),
  )
  const featuredNews = newsPosts.filter((post) => home.featuredNews.includes(post.slug))

  return (
    <main>
      <section className="page-wrap hero-shell hero-layout">
        <div className="hero-copy">
          <p className="eyebrow">{home.eyebrow}</p>
          <h1>{home.title}</h1>
          <p className="lede">{home.summary}</p>
          <div className="action-row">
            <ActionLink link={home.primaryCta} className="button-primary" />
            <ActionLink link={home.secondaryCta} className="button-secondary" />
          </div>
        </div>

        <div className="hero-visual" aria-label="Схема роботи організації">
          <div className="hero-visual-header">
            <span>запит</span>
            <strong>перевірка / координація / передача</strong>
          </div>
          <div className="hero-visual-route">
            {home.proofPoints.map((point, index) => (
              <div key={point.label} className="route-step">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{point.label}</p>
                <strong>{point.value}</strong>
              </div>
            ))}
          </div>
          <div className="hero-visual-note">
            <span aria-hidden="true" />
            <p>Допомога має бути зрозумілою, адресною і підтвердженою.</p>
          </div>
        </div>
      </section>

      <section className="proof-band">
        <div className="page-wrap proof-grid">
          {home.proofPoints.map((point) => (
            <div key={point.label} className="proof-item">
              <p className="meta">{point.label}</p>
              <strong>{point.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="page-wrap section-grid">
        <div>
          <p className="eyebrow">Проєкти</p>
          <h2>Робота, яку можна перевірити і підтримати.</h2>
          <Link to="/proekty/" className="text-link">
            <span>Усі проєкти</span>
            <ArrowUpRightIcon className="text-link-icon" />
          </Link>
        </div>
        <div className="card-grid compact-grid">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="page-wrap section-grid">
        <div>
          <p className="eyebrow">Новини</p>
          <h2>Оновлення і матеріали організації.</h2>
          <Link to="/novyny/" className="text-link">
            <span>Усі новини</span>
            <ArrowUpRightIcon className="text-link-icon" />
          </Link>
        </div>
        <div className="card-grid compact-grid">
          {featuredNews.map((post) => (
            <NewsCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </main>
  )
}

function ActionLink({ link, className }: { link: LinkItem; className: string }) {
  if (link.href.startsWith('/')) {
    return (
      <Link to={link.href} className={className}>
        {link.label}
      </Link>
    )
  }

  return (
    <a href={link.href} className={className}>
      {link.label}
    </a>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const params = useMemo(() => ({ slug: project.slug }), [project.slug])

  return (
    <Link to="/proekty/$slug/" params={params} className="content-card card-link">
      {project.coverImage ? (
        <CardCover
          url={project.coverImage.url}
          alt={project.coverImage.decorative ? '' : (project.coverImage.alt ?? '')}
        />
      ) : null}
      <p className="meta status-pill">{statusLabel(project.status)}</p>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <span className="card-affordance" aria-hidden="true">
        <ArrowUpRightIcon className="card-affordance-icon" />
      </span>
    </Link>
  )
}

function NewsCard({ post }: { post: NewsPost }) {
  const params = useMemo(() => ({ slug: post.slug }), [post.slug])

  return (
    <Link to="/novyny/$slug/" params={params} className="content-card card-link">
      {post.coverImage ? (
        <CardCover
          url={post.coverImage.url}
          alt={post.coverImage.decorative ? '' : (post.coverImage.alt ?? '')}
        />
      ) : null}
      <p className="meta">{post.date}</p>
      <h3>{post.title}</h3>
      <p>{post.summary}</p>
      <span className="card-affordance" aria-hidden="true">
        <ArrowUpRightIcon className="card-affordance-icon" />
      </span>
    </Link>
  )
}

function CardCover({ url, alt }: { url: string; alt: string }) {
  return (
    <div className="card-cover">
      <img src={url} alt={alt} loading="lazy" />
    </div>
  )
}

function statusLabel(status: Project['status']) {
  const labels: Record<Project['status'], string> = {
    planned: 'Планується',
    active: 'Активний',
    completed: 'Завершений',
    archived: 'Архів',
  }

  return labels[status]
}
