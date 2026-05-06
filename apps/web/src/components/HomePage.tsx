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
          <a href={home.primaryCta.href} className="button-primary">
            {home.primaryCta.label}
          </a>
          <a href={home.secondaryCta.href} className="button-secondary">
            {home.secondaryCta.label}
          </a>
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
          <a href="/proekty/" className="text-link">
            Усі проєкти
          </a>
        </div>
        <div className="card-grid compact-grid">
          {featuredProjects.map((project) => (
            <article key={project.slug} className="content-card">
              <p className="meta">{statusLabel(project.status)}</p>
              <h3>
                <a href={project.href}>{project.title}</a>
              </h3>
              <p>{project.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-wrap section-grid">
        <div>
          <p className="eyebrow">Новини</p>
          <h2>Оновлення і матеріали організації.</h2>
          <a href="/novyny/" className="text-link">
            Усі новини
          </a>
        </div>
        <div className="card-grid compact-grid">
          {featuredNews.map((post) => (
            <article key={post.slug} className="content-card">
              <p className="meta">{post.date}</p>
              <h3>
                <a href={post.href}>{post.title}</a>
              </h3>
              <p>{post.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
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
