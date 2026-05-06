export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="page-wrap footer-inner">
        <div>
          <p className="footer-brand">Побратими разом</p>
          <p className="m-0 text-sm">
            &copy; {year} ГО «Побратими разом». Всі права захищені.
          </p>
        </div>
        <div className="footer-links">
          <a href="/proekty/">Проєкти</a>
          <a href="/novyny/">Новини</a>
          <a href="/contacts/">Контакти</a>
        </div>
      </div>
    </footer>
  )
}
