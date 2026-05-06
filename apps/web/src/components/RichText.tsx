import type { ContentBlock } from '../content/types'

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

          return <Heading key={key}>{block.text}</Heading>
        }

        if (block.type === 'list') {
          const List = block.style === 'number' ? 'ol' : 'ul'

          return (
            <List key={key}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </List>
          )
        }

        if (block.type === 'quote') {
          return <blockquote key={key}>{block.text}</blockquote>
        }

        if (block.type === 'callout') {
          return (
            <aside key={key} className={`callout callout-${block.tone}`}>
              {block.text}
            </aside>
          )
        }

        return <p key={key}>{block.text}</p>
      })}
    </div>
  )
}

function blockKey(block: ContentBlock, salt: number) {
  if (block.type === 'list') {
    return `${block.type}:${block.style}:${block.items.join('|')}:${salt}`
  }

  return `${block.type}:${block.text}:${salt}`
}
