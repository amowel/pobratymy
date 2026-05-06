export function validateSlug(slug: unknown) {
  if (!isRecord(slug) || typeof slug.current !== 'string' || !slug.current) {
    return 'Required'
  }

  return (
    /^[a-z0-9-]+$/u.test(slug.current) ||
    'Use lowercase Latin letters, numbers, and hyphens only.'
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
