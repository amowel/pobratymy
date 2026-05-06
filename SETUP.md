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

The public app falls back to typed seed content when `VITE_SANITY_PROJECT_ID`
is missing. Cloudflare Builds must provide the production Sanity variables so
prerendering fetches published content from the public Sanity dataset.

Cloudflare Builds setup:

1. Open Workers & Pages > `pobratymy-web` > Settings > Builds.
2. Connect the GitHub repository `amowel/pobratymy`.
3. Set production branch to `main`.
4. Leave root directory as the repository root so Cloudflare uses the workspace
   lockfile.
5. Set build command to `pnpm --filter @pobratymy/web run build`.
6. Set deploy command to `pnpm --filter @pobratymy/web exec wrangler deploy`.
7. Add build environment variables:
   - `VITE_SANITY_PROJECT_ID=o109v8h2`
   - `VITE_SANITY_DATASET=production`
   - `VITE_SITE_URL=https://pobratymy.com`
   - `CLOUDFLARE_INCLUDE_PROCESS_ENV=true`
8. Create a Deploy Hook named `sanity-production` for branch `main` and copy
   its URL.

## Sanity Publish-to-Live

The website is prerendered during Cloudflare Worker builds, so content publishes
need to trigger a fresh web deploy. Use a Sanity webhook that POSTs directly to
the Cloudflare Deploy Hook URL.

One-time setup:

1. Create the Cloudflare Deploy Hook described above.
2. Create a Sanity document webhook:
   - URL: the Cloudflare Deploy Hook URL
   - Method: `POST`
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

Keep the Deploy Hook URL private. Anyone with that URL can trigger a build, so
rotate it in Cloudflare if it is exposed.

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
