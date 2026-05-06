import { Link } from '@tanstack/react-router'

const links = [
  { label: 'Про нас', to: '/pro-nas/' },
  { label: 'Проєкти', to: '/proekty/' },
  { label: 'Новини', to: '/novyny/' },
  { label: 'Галерея', to: '/galereia/' },
  { label: 'Відео', to: '/video/' },
  { label: 'Контакти', to: '/contacts/' },
] as const

const activeNavProps = { className: 'nav-link nav-link-active' } as const

export default function Header() {
  return (
    <header className="site-header">
      <nav className="page-wrap site-nav" aria-label="Головна навігація">
        <p className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
          <Link to="/" className="brand-link" aria-label="Побратими разом, на головну">
            <span className="brand-mark" aria-hidden="true" />
            Побратими разом
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
