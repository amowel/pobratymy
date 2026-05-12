import { Link } from '@tanstack/react-router'
import type { SiteSettings } from '../content/types'

const links = [
  { label: 'Про нас', to: '/pro-nas/' },
  { label: 'Проєкти', to: '/proekty/' },
  { label: 'Новини', to: '/novyny/' },
  { label: 'Галерея', to: '/galereia/' },
  { label: 'Відео', to: '/video/' },
  { label: 'Контакти', to: '/contacts/' },
] as const

const activeNavProps = { className: 'nav-link nav-link-active' } as const

export default function Header({ settings }: { settings?: SiteSettings }) {
  const title = settings?.title || 'Побратими разом'

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
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="nav-link"
              activeProps={activeNavProps}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/dopomogty/" className="support-link">
            Підтримати
          </Link>
        </div>
      </nav>
    </header>
  )
}
