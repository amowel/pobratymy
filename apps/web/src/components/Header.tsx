import { Link } from '@tanstack/react-router'

const links = [
  ['Про нас', '/pro-nas/'],
  ['Проєкти', '/proekty/'],
  ['Новини', '/novyny/'],
  ['Відео', '/video/'],
  ['Контакти', '/contacts/'],
]

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
          {links.map(([label, href]) => (
            <a key={href} href={href} className="nav-link">
              {label}
            </a>
          ))}
          <a href="/dopomogty/" className="support-link">
            Підтримати
          </a>
        </div>
      </nav>
    </header>
  )
}
