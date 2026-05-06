import { SIGNATURE_HEADER_NAME, isValidSignature } from '@sanity/webhook'
import { createFileRoute } from '@tanstack/react-router'

const githubOwner = 'amowel'
const githubRepo = 'pobratymy'
const workflowFile = 'deploy-web.yml'
const githubApiVersion = '2022-11-28'
const githubDispatchUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/actions/workflows/${workflowFile}/dispatches`

const contentTypes = new Set([
  'galleryAlbum',
  'newsPost',
  'page',
  'person',
  'project',
  'siteSettings',
  'video',
])

interface SanityRedeployPayload {
  _id?: unknown
  _type?: unknown
  routeId?: unknown
  slug?: unknown
  title?: unknown
}

export const Route = createFileRoute('/api/sanity-redeploy')({
  server: {
    handlers: {
      GET: () =>
        json(
          { error: 'Method not allowed' },
          { headers: { Allow: 'POST' }, status: 405 },
        ),
      POST: async ({ request }) => {
        const webhookSecret = process.env.SANITY_REDEPLOY_WEBHOOK_SECRET
        const githubToken = process.env.GITHUB_REDEPLOY_TOKEN

        if (!webhookSecret || !githubToken) {
          return json({ error: 'Redeploy webhook is not configured.' }, { status: 500 })
        }

        const signature = request.headers.get(SIGNATURE_HEADER_NAME)
        const rawBody = await request.text()
        if (
          !signature ||
          !(await isValidSignature(rawBody, signature, webhookSecret))
        ) {
          return json({ error: 'Invalid Sanity webhook signature.' }, { status: 401 })
        }

        const payload = parsePayload(rawBody)
        const documentType = readString(payload._type)

        if (!documentType || !contentTypes.has(documentType)) {
          return json({
            queued: false,
            reason: 'Document type does not affect the public website.',
            documentType,
          })
        }

        const dispatchResponse = await fetch(githubDispatchUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${githubToken}`,
            'Content-Type': 'application/json',
            'User-Agent': 'pobratymy-sanity-redeploy',
            'X-GitHub-Api-Version': githubApiVersion,
          },
          body: JSON.stringify({
            ref: 'main',
            inputs: {
              document_id: readString(payload._id) ?? '',
              document_type: documentType,
              operation: request.headers.get('sanity-operation') ?? '',
              route_id: readString(payload.routeId) ?? '',
              slug: readString(payload.slug) ?? '',
              source: 'sanity',
              title: readString(payload.title) ?? '',
            },
          }),
        })

        if (!dispatchResponse.ok) {
          return json(
            {
              error: 'GitHub deploy workflow dispatch failed.',
              status: dispatchResponse.status,
              detail: await dispatchResponse.text(),
            },
            { status: 502 },
          )
        }

        return json({
          queued: true,
          workflow: workflowFile,
          ref: 'main',
          documentType,
        })
      },
    },
  },
})

function parsePayload(rawBody: string): SanityRedeployPayload {
  try {
    const payload: unknown = JSON.parse(rawBody)

    return isRecord(payload) ? payload : {}
  } catch {
    return {}
  }
}

function readString(value: unknown) {
  return typeof value === 'string' ? value : undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function json(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers)
  headers.set('Cache-Control', 'no-store')
  headers.set('Content-Type', 'application/json')

  return Response.json(body, { ...init, headers })
}
