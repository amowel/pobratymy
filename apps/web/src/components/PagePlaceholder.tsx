interface PagePlaceholderProps {
  title: string
  description: string
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <main className="page-wrap">
      <section className="content-shell">
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
    </main>
  )
}
