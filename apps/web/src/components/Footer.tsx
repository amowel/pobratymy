export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="page-wrap footer-inner">
        <p className="m-0 text-sm">
          &copy; {year} ГО «Побратими разом». Всі права захищені.
        </p>
        <a href="/contacts/">Контакти</a>
      </div>
    </footer>
  )
}
