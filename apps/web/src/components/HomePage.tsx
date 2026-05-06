import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import type { HomeContent, NewsPost, Project } from '../content/types'

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
      <section className="page-wrap hero-shell">
        <p className="eyebrow">{home.eyebrow}</p>
        <h1>{home.title}</h1>
        <p className="lede">{home.summary}</p>
        <div className="action-row">
          <Link to="/dopomogty/" className="button-primary">
            {home.primaryCta.label}
          </Link>
          <Link to="/proekty/" className="button-secondary">
            {home.secondaryCta.label}
          </Link>
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
            Усі проєкти
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
            Усі новини
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

function ProjectCard({ project }: { project: Project }) {
  const params = useMemo(() => ({ slug: project.slug }), [project.slug])

  return (
    <Link to="/proekty/$slug/" params={params} className="content-card card-link">
      <p className="meta">{statusLabel(project.status)}</p>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
    </Link>
  )
}

function NewsCard({ post }: { post: NewsPost }) {
  const params = useMemo(() => ({ slug: post.slug }), [post.slug])

  return (
    <Link to="/novyny/$slug/" params={params} className="content-card card-link">
      <p className="meta">{post.date}</p>
      <h3>{post.title}</h3>
      <p>{post.summary}</p>
    </Link>
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
