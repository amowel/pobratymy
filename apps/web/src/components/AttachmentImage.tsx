import type { ImageAttachment } from '../content/types'

interface AttachmentImageProps {
  image: ImageAttachment
  className?: string
  loading?: 'eager' | 'lazy'
}

export function AttachmentImage({
  image,
  className = 'attachment-image',
  loading = 'lazy',
}: AttachmentImageProps) {
  return (
    <figure className={className}>
      <img
        src={image.url}
        alt={image.decorative ? '' : (image.alt ?? '')}
        loading={loading}
      />
      {image.caption ? <figcaption>{image.caption}</figcaption> : null}
    </figure>
  )
}

interface AttachmentGridProps {
  images: ImageAttachment[]
  label: string
}

export function AttachmentGrid({ images, label }: AttachmentGridProps) {
  if (images.length === 0) {
    return null
  }

  return (
    <section className="attachment-section" aria-label={label}>
      <div className="attachment-grid">
        {images.map((image) => (
          <AttachmentImage
            key={image.key ?? image.url}
            image={image}
            className="attachment-grid-item"
          />
        ))}
      </div>
    </section>
  )
}
