/* eslint-disable react/iframe-missing-sandbox -- YouTube and Vimeo embeds require their provider runtime to render and play. */
/* eslint-disable jsx-a11y/media-has-caption -- Uploaded videos may not have captions available in Sanity. */
import type { VideoItem } from '../content/types'
import { ArrowUpRightIcon } from './ArrowUpRightIcon'

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
              const embed = video.sourceUrl ? getVideoEmbed(video.sourceUrl) : null

              return (
                <article key={video.slug} id={video.slug} className="video-card">
                  <VideoMedia video={video} embed={embed} />
                  <div className="video-copy">
                    {video.date ? (
                      <p className="meta status-pill">{formatDate(video.date)}</p>
                    ) : null}
                    <h2>{video.title}</h2>
                    <p>{video.summary}</p>
                    <VideoActionLink video={video} />
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

function VideoMedia({
  video,
  embed,
}: {
  video: VideoItem
  embed: { url: string } | null
}) {
  if (embed) {
    return (
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
    )
  }

  if (video.uploadedVideo) {
    return (
      <div className="video-frame">
        <video controls preload="metadata" poster={video.thumbnail?.url}>
          <source src={video.uploadedVideo.url} type={video.uploadedVideo.mimeType} />
        </video>
      </div>
    )
  }

  if (video.sourceUrl) {
    return (
      <a href={video.sourceUrl} className="video-fallback">
        <VideoThumbnail video={video} />
        <span>Відкрити відео</span>
      </a>
    )
  }

  return (
    <div className="video-fallback">
      <VideoThumbnail video={video} />
      <span>Відео недоступне</span>
    </div>
  )
}

function VideoThumbnail({ video }: { video: VideoItem }) {
  if (!video.thumbnail) {
    return null
  }

  return (
    <img
      src={video.thumbnail.url}
      alt={video.thumbnail.decorative ? '' : (video.thumbnail.alt ?? '')}
      loading="lazy"
    />
  )
}

function VideoActionLink({ video }: { video: VideoItem }) {
  const href = video.sourceUrl ?? video.uploadedVideo?.url

  if (!href) {
    return null
  }

  return (
    <a href={href} className="text-link" target="_blank" rel="noreferrer">
      <span>{video.sourceUrl ? 'Відкрити джерело' : 'Відкрити відеофайл'}</span>
      <ArrowUpRightIcon className="text-link-icon" />
    </a>
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
