import { createFileRoute } from '@tanstack/react-router'

const SANITY_PROJECT_ID = 'o109v8h2'
const SANITY_DATASET = 'production'
const SIGNATURE_HEADER_NAME = 'sanity-webhook-signature'

const REDEPLOY_DOCUMENT_TYPES = new Set([
  'siteSettings',
  'page',
  'newsPost',
  'project',
  'galleryAlbum',
  'video',
  'person',
])

const REDEPLOY_OPERATIONS = new Set(['create', 'update', 'delete'])

export const Route = createFileRoute('/api/sanity-redeploy')({
  server: {
    handlers: {
      GET: () => methodNotAllowed(),
      POST: async ({ request }) => {
        const signature = request.headers.get(SIGNATURE_HEADER_NAME)

        if (!signature) {
          return json(
            { ok: false, error: 'Missing Sanity webhook signature.' },
            { status: 401 },
          )
        }

        const rawBody = await request.text()
        const env = getRedeployEnv()

        if (!env.ok) {
          return json(
            { ok: false, error: 'Redeploy webhook is not configured.' },
            { status: 500 },
          )
        }

        const { isValidSignature } = await import('@sanity/webhook')
        const isValid = await isValidSignature(rawBody, signature, env.webhookSecret)

        if (!isValid) {
          return json(
            { ok: false, error: 'Invalid Sanity webhook signature.' },
            { status: 401 },
          )
        }

        const projectId = request.headers.get('sanity-project-id')
        const dataset = request.headers.get('sanity-dataset')

        if (projectId !== SANITY_PROJECT_ID || dataset !== SANITY_DATASET) {
          return json(
            { ok: false, error: 'Webhook project or dataset is not allowed.' },
            { status: 403 },
          )
        }

        const operation = request.headers.get('sanity-operation')

        if (operation && !REDEPLOY_OPERATIONS.has(operation)) {
          return json(
            { ok: true, triggered: false, reason: 'ignored-operation' },
            { status: 202 },
          )
        }

        const payload = parseWebhookPayload(rawBody)

        if (!payload.ok) {
          return json(
            { ok: false, error: 'Invalid Sanity webhook payload.' },
            { status: 400 },
          )
        }

        if (
          typeof payload.value._id === 'string' &&
          isSanityDraftOrVersion(payload.value._id)
        ) {
          return json(
            { ok: true, triggered: false, reason: 'ignored-draft-or-version' },
            { status: 202 },
          )
        }

        if (
          typeof payload.value._type !== 'string' ||
          !REDEPLOY_DOCUMENT_TYPES.has(payload.value._type)
        ) {
          return json(
            { ok: true, triggered: false, reason: 'ignored-document-type' },
            { status: 202 },
          )
        }

        const deployResponse = await triggerCloudflareDeploy(env.deployHookUrl)

        if (!deployResponse.ok) {
          return json(
            {
              ok: false,
              error: 'Cloudflare deploy hook rejected the request.',
              status: deployResponse.status,
            },
            { status: 502 },
          )
        }

        return json(
          {
            ok: true,
            triggered: true,
            documentType: payload.value._type,
            operation: operation ?? null,
          },
          { status: 202 },
        )
      },
    },
  },
})

type RedeployEnv =
  | {
      ok: true
      deployHookUrl: string
      webhookSecret: string
    }
  | {
      ok: false
    }

type SanityWebhookPayload = Record<string, unknown> & {
  _id?: unknown
  _type?: unknown
}

function getRedeployEnv(): RedeployEnv {
  const deployHookUrl = process.env.CLOUDFLARE_DEPLOY_HOOK_URL
  const webhookSecret = process.env.SANITY_REDEPLOY_WEBHOOK_SECRET

  if (!deployHookUrl || !webhookSecret || !isHttpsUrl(deployHookUrl)) {
    return { ok: false }
  }

  return { ok: true, deployHookUrl, webhookSecret }
}

function parseWebhookPayload(
  rawBody: string,
): { ok: true; value: SanityWebhookPayload } | { ok: false } {
  try {
    const value: unknown = JSON.parse(rawBody)

    if (!isRecord(value)) {
      return { ok: false }
    }

    return { ok: true, value }
  } catch {
    return { ok: false }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isSanityDraftOrVersion(documentId: string) {
  return documentId.startsWith('drafts.') || documentId.startsWith('versions.')
}

async function triggerCloudflareDeploy(deployHookUrl: string) {
  try {
    return await fetch(deployHookUrl, { method: 'POST' })
  } catch {
    return Response.json(null, { status: 502 })
  }
}

function methodNotAllowed() {
  return json(
    { ok: false, error: 'Method not allowed.' },
    {
      status: 405,
      headers: {
        Allow: 'POST',
      },
    },
  )
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers)
  headers.set('Cache-Control', 'no-store')

  return Response.json(data, {
    ...init,
    headers,
  })
}
