import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main className="page-wrap">
      <section className="hero-shell">
        <h1>Ветеранська та волонтерська спільнота, що підтримує своїх поруч.</h1>
        <p>
          Це стартова структура нового сайту. Дизайн, бренд-система і контент будуть
          реалізовані наступним етапом на основі узгодженого плану.
        </p>
        <div className="action-row">
          <a href="/dopomogty/" className="button-primary">
            Підтримати
          </a>
          <a href="/proekty/" className="button-secondary">
            Проєкти
          </a>
        </div>
      </section>
    </main>
  )
}
