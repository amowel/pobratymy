import { Link } from '@tanstack/react-router'
import type { LinkItem, SiteSettings } from '../content/types'

const activeNavProps = { className: 'nav-link nav-link-active' } as const

export default function Header({ settings }: { settings?: SiteSettings }) {
  const title = settings?.title || 'Побратими разом'
  const navigationLinks = settings?.navigationLinks ?? []
  const supportCta = settings?.supportCta

  return (
    <header className="site-header">
      <nav className="page-wrap site-nav" aria-label="Головна навігація">
        <p className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
          <Link to="/" className="brand-link" aria-label={`${title}, на головну`}>
            {settings?.logo ? (
              <img
                src={settings.logo.url}
                alt={settings.logo.decorative ? '' : (settings.logo.alt ?? '')}
                className="brand-logo"
              />
            ) : (
              <span className="brand-mark" aria-hidden="true" />
            )}
            {title}
          </Link>
        </p>

        <div className="nav-links">
          {navigationLinks.map((link) => (
            <HeaderLink
              key={`${link.label}:${link.href}`}
              link={link}
              className="nav-link"
            />
          ))}
          {supportCta ? (
            <HeaderLink link={supportCta} className="support-link" />
          ) : null}
        </div>
      </nav>
    </header>
  )
}

function HeaderLink({ link, className }: { link: LinkItem; className: string }) {
  if (isInternalPath(link.href)) {
    return (
      <Link to={link.href} className={className} activeProps={activeNavProps}>
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

function isInternalPath(href: string) {
  return href.startsWith('/')
}
