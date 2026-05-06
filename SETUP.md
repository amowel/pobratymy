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

Recommended deployment setup:

1. Connect the GitHub repository in Cloudflare Workers Builds.
2. Set the production branch to `main`.
3. Build command: `pnpm build:web`.
4. Deploy command: use Cloudflare's detected Worker deploy flow for the app in `apps/web`.
5. Add Sanity project variables in Cloudflare build settings.
6. Create a Cloudflare deploy hook.
7. Add a Sanity webhook that calls the Cloudflare deploy hook on publish.

The public app currently falls back to typed seed content when `VITE_SANITY_PROJECT_ID`
is missing. Once Sanity is configured, production builds should fetch published content
from the public Sanity dataset during prerendering.

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
