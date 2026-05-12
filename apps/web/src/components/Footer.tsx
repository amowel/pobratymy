import type { SiteSettings } from '../content/types'

export default function Footer({ settings }: { settings?: SiteSettings }) {
  const year = new Date().getFullYear()
  const title = settings?.title || 'Побратими разом'
  const visibleSocialLinks = settings?.socialLinks.filter((link) => link.url) ?? []

  return (
    <footer className="site-footer">
      <div className="page-wrap footer-inner">
        <div>
          <p className="footer-brand">{title}</p>
          <p className="m-0 text-sm">
            &copy; {year} ГО «{title}». Всі права захищені.
          </p>
          {settings?.email ? (
            <p className="footer-contact">
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </p>
          ) : null}
        </div>
        <div className="footer-nav">
          <div className="footer-links">
            <a href="/proekty/">Проєкти</a>
            <a href="/novyny/">Новини</a>
            <a href="/contacts/">Контакти</a>
          </div>
          {visibleSocialLinks.length > 0 ? (
            <div className="footer-links footer-socials">
              {visibleSocialLinks.map((link) => (
                <a key={`${link.label}:${link.url}`} href={link.url}>
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
