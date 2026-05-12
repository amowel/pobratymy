import type { PageContent, Person, SiteSettings } from '../content/types'
import { AttachmentImage } from './AttachmentImage'
import { RichText } from './RichText'

interface ContentPageProps {
  page: PageContent
  settings?: SiteSettings
  people?: Person[]
}

const emptyPeople: Person[] = []

export function ContentPage({
  page,
  settings,
  people = emptyPeople,
}: ContentPageProps) {
  return (
    <main className="page-wrap">
      <article className="content-shell content-shell-wide">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p className="lede">{page.summary}</p>
        {page.coverImage ? (
          <AttachmentImage
            image={page.coverImage}
            className="cover-image"
            loading="eager"
          />
        ) : null}
        <RichText blocks={page.body} />
        {page.routeId === 'contacts' && settings ? (
          <ContactDetails settings={settings} />
        ) : null}
        {page.routeId === 'help' && settings ? (
          <DonationDetails settings={settings} />
        ) : null}
        {['about', 'aboutUs'].includes(page.routeId) && people.length > 0 ? (
          <PeopleSection people={people} />
        ) : null}
      </article>
    </main>
  )
}

function ContactDetails({ settings }: { settings: SiteSettings }) {
  const contactItems = [
    settings.email
      ? {
          label: 'Email',
          value: settings.email,
          href: `mailto:${settings.email}`,
        }
      : undefined,
    settings.phone
      ? {
          label: 'Телефон',
          value: settings.phone,
          href: `tel:${settings.phone.replaceAll(/[^+\d]/gu, '')}`,
        }
      : undefined,
    settings.address
      ? {
          label: 'Адреса',
          value: settings.address,
        }
      : undefined,
  ].filter(
    (item): item is { label: string; value: string; href?: string } =>
      item !== undefined,
  )

  if (contactItems.length === 0 && settings.socialLinks.length === 0) {
    return null
  }

  return (
    <section className="detail-panel-grid" aria-label="Контактна інформація">
      {contactItems.map((item) => (
        <div key={item.label} className="detail-panel">
          <p className="meta">{item.label}</p>
          {item.href ? <a href={item.href}>{item.value}</a> : <p>{item.value}</p>}
        </div>
      ))}
      {settings.socialLinks.length > 0 ? (
        <div className="detail-panel">
          <p className="meta">Соціальні мережі</p>
          <div className="inline-link-list">
            {settings.socialLinks.map((link) => (
              <a key={`${link.label}:${link.url}`} href={link.url}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

function DonationDetails({ settings }: { settings: SiteSettings }) {
  if (settings.donationDetails.length === 0) {
    return null
  }

  return (
    <section className="detail-panel-grid" aria-label="Реквізити та формати підтримки">
      {settings.donationDetails.map((detail) => (
        <div key={`${detail.label}:${detail.value}`} className="detail-panel">
          <p className="meta">{detail.label}</p>
          <p>{detail.value}</p>
        </div>
      ))}
    </section>
  )
}

function PeopleSection({ people }: { people: Person[] }) {
  return (
    <section className="people-section" aria-label="Команда">
      <h2>Команда</h2>
      <div className="people-grid">
        {people.map((person) => (
          <article key={person.name} className="person-card">
            {person.photo ? (
              <AttachmentImage image={person.photo} className="person-photo" />
            ) : null}
            <div>
              <h3>{person.name}</h3>
              {person.role ? <p className="meta">{person.role}</p> : null}
              <RichText blocks={person.bio} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
