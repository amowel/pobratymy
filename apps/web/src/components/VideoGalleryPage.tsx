/* eslint-disable react/iframe-missing-sandbox -- YouTube and Vimeo embeds require their provider runtime to render and play. */
import type { VideoItem } from '../content/types'

interface VideoGalleryPageProps {
  eyebrow: string
  title: string
  summary: string
  videos: VideoItem[]
  emptyLabel?: string
}

export function VideoGalleryPage({
  eyebrow,
  title,
  summary,
  videos,
  emptyLabel = 'Відео з’являться після наповнення CMS.',
}: VideoGalleryPageProps) {
  return (
    <main className="page-wrap">
      <section className="content-shell content-shell-wide">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lede">{summary}</p>

        {videos.length > 0 ? (
          <div className="video-grid">
            {videos.map((video) => {
              const embed = getVideoEmbed(video.sourceUrl)

              return (
                <article key={video.slug} id={video.slug} className="video-card">
                  {embed ? (
                    <div className="video-frame">
                      <iframe
                        src={embed.url}
                        title={video.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <a href={video.sourceUrl} className="video-fallback">
                      Відкрити відео
                    </a>
                  )}
                  <div className="video-copy">
                    {video.date ? (
                      <p className="meta status-pill">{formatDate(video.date)}</p>
                    ) : null}
                    <h2>{video.title}</h2>
                    <p>{video.summary}</p>
                    <a
                      href={video.sourceUrl}
                      className="text-link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Відкрити джерело
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <p className="empty-state">{emptyLabel}</p>
        )}
      </section>
    </main>
  )
}

function getVideoEmbed(sourceUrl: string) {
  try {
    const url = new URL(sourceUrl)
    const host = url.hostname.replace(/^www\./u, '')

    if (host === 'youtu.be') {
      const id = firstPathSegment(url)
      return id ? youtubeEmbed(id) : null
    }

    if (
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host.endsWith('.youtube.com')
    ) {
      const watchId = url.searchParams.get('v')

      if (watchId) {
        return youtubeEmbed(watchId)
      }

      const [, type, id] = url.pathname.split('/')

      if (['embed', 'shorts', 'live'].includes(type) && id) {
        return youtubeEmbed(id)
      }
    }

    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const id = firstPathSegment(url)
      return id
        ? { url: `https://player.vimeo.com/video/${encodeURIComponent(id)}` }
        : null
    }
  } catch {
    return null
  }

  return null
}

function youtubeEmbed(id: string) {
  return {
    url: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`,
  }
}

function firstPathSegment(url: URL) {
  return url.pathname.split('/').find(Boolean)
}

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
