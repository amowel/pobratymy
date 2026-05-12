import type { ReactNode } from 'react'
import type { ContentBlock, RichTextInline } from '../content/types'
import { AttachmentImage } from './AttachmentImage'

interface RichTextProps {
  blocks: ContentBlock[]
}

export function RichText({ blocks }: RichTextProps) {
  if (blocks.length === 0) {
    return null
  }

  return (
    <div className="rich-text">
      {blocks.map((block, index) => {
        const key = blockKey(block, index)

        if (block.type === 'heading') {
          const Heading = block.level === 2 ? 'h2' : 'h3'

          return <Heading key={key}>{renderInline(block)}</Heading>
        }

        if (block.type === 'list') {
          const List = block.style === 'number' ? 'ol' : 'ul'

          return (
            <List key={key}>
              {block.items.map((item) => (
                <li key={inlineKey(item)}>{renderInline(item)}</li>
              ))}
            </List>
          )
        }

        if (block.type === 'quote') {
          return <blockquote key={key}>{renderInline(block)}</blockquote>
        }

        if (block.type === 'callout') {
          return (
            <aside key={key} className={`callout callout-${block.tone}`}>
              {block.text}
            </aside>
          )
        }

        if (block.type === 'image') {
          return <AttachmentImage key={key} image={block} className="rich-text-image" />
        }

        return <p key={key}>{renderInline(block)}</p>
      })}
    </div>
  )
}

function renderInline(
  value:
    | string
    | RichTextInline[]
    | Extract<ContentBlock, { type: 'heading' | 'paragraph' | 'quote' }>,
) {
  if (typeof value === 'string') {
    return value
  }

  const children = Array.isArray(value) ? value : value.children

  if (!children || children.length === 0) {
    return Array.isArray(value) ? null : value.text
  }

  return children.map((child, index) => {
    const key = child.key ?? `${child.text}:${child.href ?? ''}:${index}`
    let node: ReactNode = child.text

    if (child.marks?.includes('strong')) {
      node = <strong>{node}</strong>
    }

    if (child.marks?.includes('em')) {
      node = <em>{node}</em>
    }

    if (child.href) {
      node = (
        <a href={child.href} target={externalTarget(child.href)} rel="noreferrer">
          {node}
        </a>
      )
    }

    return <span key={key}>{node}</span>
  })
}

function inlineText(value: string | RichTextInline[]) {
  return typeof value === 'string' ? value : value.map((child) => child.text).join('')
}

function inlineKey(value: string | RichTextInline[]) {
  return typeof value === 'string'
    ? value
    : value.map((child) => child.key).join(':') || inlineText(value)
}

function externalTarget(href: string) {
  return href.startsWith('http://') || href.startsWith('https://')
    ? '_blank'
    : undefined
}

function blockKey(block: ContentBlock, salt: number) {
  if (block.type === 'list') {
    return `${block.type}:${block.style}:${block.items.map(inlineText).join('|')}:${salt}`
  }

  if (block.type === 'image') {
    return `${block.type}:${block.url}:${salt}`
  }

  return `${block.type}:${block.text}:${salt}`
}
