# Setup

## Local Prerequisites

- Node.js 24+
- pnpm via Corepack

```bash
corepack enable pnpm
pnpm install
```

## Sanity

The Studio source lives in `apps/studio`, but the editing UI should be hosted by Sanity.

Current Sanity project:

- Organization: `Pobratymy`
- Organization ID: `owpww6F2i`
- Project name: `Pobratymy CMS`
- Project ID: `o109v8h2`
- Dataset: `production`
- Studio URL: `https://pobratymy.sanity.studio/`
- Studio app ID: `fppsn3u9pib2d9kdziy9eiwm`
- CORS origins: `http://localhost:3000`, `http://localhost:3001`, `https://pobratymy-web.pobratymy.workers.dev`, `https://pobratymy.com`

Local environment:

```bash
SANITY_STUDIO_PROJECT_ID=o109v8h2
SANITY_STUDIO_DATASET=production
VITE_SANITY_PROJECT_ID=o109v8h2
VITE_SANITY_DATASET=production
VITE_SITE_URL=https://pobratymy.com
```

Preferred Studio hostname:

```bash
cd apps/studio
pnpm run deploy
```

## Cloudflare

The public site is configured for Cloudflare Workers with Workers Assets through the official TanStack Start Cloudflare setup.

Current Worker:

- Account: `Genal.igor@gmail.com's Account`
- Account ID: `670a46658b7d6e6b27e0c4799c760633`
- Worker name: `pobratymy-web`
- workers.dev subdomain: `pobratymy`
- Preview URL: `https://pobratymy-web.pobratymy.workers.dev`

GitHub Actions deployment secrets:

- `CLOUDFLARE_ACCOUNT_ID`: `670a46658b7d6e6b27e0c4799c760633`
- `CLOUDFLARE_API_TOKEN`: Cloudflare API token with permission to deploy `pobratymy-web`.

The public app falls back to typed seed content when `VITE_SANITY_PROJECT_ID`
is missing. The `Deploy Web` workflow provides the production Sanity variables
so prerendering fetches published content from the public Sanity dataset.

## Sanity Publish-to-Live

The website is prerendered during Cloudflare Worker builds, so content publishes
need to trigger a fresh web deploy. The Worker exposes a signed webhook endpoint
that verifies Sanity requests and dispatches the `Deploy Web` GitHub Actions
workflow.

One-time setup:

1. Create a fine-grained GitHub token for `amowel/pobratymy` with `Actions: Read and write`.
2. Generate a webhook secret:

   ```bash
   openssl rand -hex 32
   ```

3. Store runtime Worker secrets:

   ```bash
   cd apps/web
   pnpm exec wrangler secret put SANITY_REDEPLOY_WEBHOOK_SECRET
   pnpm exec wrangler secret put GITHUB_REDEPLOY_TOKEN
   ```

4. Create a Sanity document webhook:
   - URL: `https://pobratymy-web.pobratymy.workers.dev/api/sanity-redeploy`
   - Dataset: `production`
   - Trigger on: `create`, `update`, `delete`
   - Drafts/versions: disabled
   - Filter:

     ```groq
     _type in ["siteSettings", "page", "newsPost", "project", "galleryAlbum", "video", "person"]
     ```

   - Projection:

     ```groq
     {
       "_id": _id,
       "_type": _type,
       "routeId": routeId,
       "slug": slug.current,
       "title": title
     }
     ```

   - Secret: the same value stored in `SANITY_REDEPLOY_WEBHOOK_SECRET`.

Manual local deploy, if needed:

```bash
pnpm --filter @pobratymy/web deploy
```

## Quality Checks

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
pnpm check
```

The project intentionally starts without unit tests or Playwright. Add them later when real logic or critical interactive flows justify the overhead.

## Ownership Transfer Notes

For v1, accounts can live under personal ownership. Keep these ready for future transfer:

- GitHub repository ownership transfer.
- Cloudflare account/member transfer and DNS access.
- Sanity project transfer or organization migration.
- Environment variable inventory.
- Deploy hook inventory.
