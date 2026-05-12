import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { getSiteContent } from '../content/sanity'
import { seoMeta } from '../content/seo'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  loader: () => getSiteContent(),
  head: ({ loaderData }) => ({
    meta: [
      {
        charSet: 'utf8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seoMeta(
        loaderData?.settings.defaultSeo ?? {
          title: 'Побратими разом',
          description: 'Громадська організація ветеранів та волонтерів в Україні.',
        },
      ),
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      ...(loaderData?.settings.favicon
        ? [
            {
              rel: 'icon',
              href: loaderData.settings.favicon.url,
            },
          ]
        : []),
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function NotFound() {
  return (
    <main className="page-wrap">
      <section className="content-shell">
        <h1>Сторінку не знайдено</h1>
        <p>Перевірте адресу або поверніться на головну сторінку.</p>
        <a href="/" className="button-primary">
          На головну
        </a>
      </section>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const content = Route.useLoaderData()

  return (
    <html lang="uk">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere]">
        <Header settings={content.settings} />
        {children}
        <Footer settings={content.settings} />
        <Scripts />
      </body>
    </html>
  )
}
