# Pobratymy Website Rebuild Plan

## Goal

Reimplement `pobratymy.com` from scratch with a stronger modern design, easier content editing, and zero fixed hosting cost for v1.

The new site should keep the current site's general idea: a public website for a Ukrainian veteran and volunteer organization, with pages for mission, projects, news, media, donations/help, and contacts. The redesign should improve credibility, clarity, and trust without turning the site into a generic charity template.

## Primary Audience

1. Donors and supporters who may contribute money, supplies, or services.
2. Potential partners: businesses, NGOs, local authorities, media.
3. Volunteers and community members who may join or help.
4. Veterans, beneficiaries, and families who need to understand available support.

## Product Direction

The site's primary job is to help visitors quickly understand who the organization is, what it does, see proof of real activity, and take action through donations, partnership, volunteering, or contact.

Primary CTA: `Підтримати`.

Secondary CTA: `Проєкти` or equivalent route-specific project exploration.

## Design Direction

Brand personality:

- Institutional
- Human
- Field-tested
- Veteran-rooted
- Civilian-accessible
- Resolute
- Practical

The design should acknowledge Ukraine's wartime context directly and respectfully. Military cues are acceptable when they feel earned and dignified. The site should not sanitize the organization into generic nonprofit softness, but it also should not become performative or decorative military cosplay.

Logo and identity direction:

- Refresh the current logo/brand assets, not just the website UI.
- Keep the broad concept of human support and brotherhood.
- Use an evolutionary redesign rather than a fully unrelated replacement.
- Simplify the mark so it works as a header logo, favicon, social avatar, and printed asset.
- Controlled military symbolism is acceptable.
- Avoid making a literal weapon the central logo element unless stakeholders later require it.

Color direction:

- Deep ink/navy for authority and text.
- Muted field green/olive for grounded institutional identity.
- Warm off-white/paper surfaces.
- Ukrainian blue/yellow as restrained accents, not the whole theme.
- One signal color for urgent donation/help moments.

Detailed page UI decisions will be made during design implementation using the `impeccable` skill and the context above.

## Scope

### V1 Includes

- Editable homepage content.
- Editable static pages.
- News listing and news detail pages.
- Projects listing and project detail pages.
- Gallery albums/photos.
- Video page with external embeds.
- Donation/help page with verified instructions.
- Contact page with direct contact and social links.
- Basic SEO fields.
- Sitemap and `robots.txt`.
- Cloudflare Web Analytics.
- CMS-managed image assets.
- Responsive, accessible public site.

### V1 Excludes

- Custom online payment processing.
- User accounts.
- Comments.
- Custom contact forms.
- Advanced search.
- Advanced filters.
- Full public-site draft preview.
- Broad unit test or Playwright coverage before there is meaningful logic.
- Terraform, Alchemy, or heavier infrastructure-as-code layers.

## Tech Stack

Package manager: `pnpm`.

Repository shape: single monorepo.

Suggested structure:

```text
apps/
  web/      # TanStack Start public site
  studio/   # Sanity Studio source and schemas
packages/
  ...       # Only add shared packages when there is real shared code
```

Frontend:

- TanStack Start.
- React.
- TypeScript.
- Vite-based setup.
- Tailwind CSS.
- Small custom component/design system.
- No heavy public-site component library by default.
- No separate Vite+ toolchain layer.

Starter preference:

- Start from the official Cloudflare/TanStack Start scaffold or official example.
- Avoid opinionated third-party starters unless they provide clear value without lock-in.

Quality tooling:

- Oxc toolchain.
- `oxlint` for linting.
- `oxfmt` for formatting.
- Strict TypeScript checking.
- Production build check.
- CI should run fast checks: lint, format check, typecheck, build.
- No unit tests until the code has real logic worth testing.
- No Playwright until the UI/content flows justify browser automation.

Monorepo boundaries:

- Use light boundaries only.
- Use simple per-app path aliases such as `@/`.
- Avoid deep cross-app imports.
- Add shared packages only when needed.
- Do not add Nx/Turborepo initially.

## CMS

CMS: Sanity.

Studio:

- Keep Studio source in `apps/studio`.
- Deploy Studio to Sanity-hosted Studio with `sanity deploy`.
- Preferred hostname: `pobratymy.sanity.studio`, if available.
- Do not host Studio under the public site.
- Do not deploy Studio to Cloudflare for v1.

Dataset:

- Use a public dataset for published public content.
- Do not store sensitive, private, donor, or internal operational data in Sanity.

Editing model:

- Structured CMS editing, not a freeform page builder.
- Editors control content, media, links, featured items, donation details, and SEO metadata.
- The design system controls layouts.

Draft previews:

- No full public-site draft preview in v1.
- Published content updates through rebuilds.
- Add richer preview later if editors need it.

Content validation:

- Strict required fields for content needed to render pages cleanly.
- Require title, slug, publish date, summaries, and cover images where layout depends on them.
- Require image alt text or an explicit decorative flag.
- Validate video URLs.
- Restrict fixed-route pages to known route IDs.
- Use constrained Portable Text for rich content.

Allowed rich text:

- Paragraphs.
- `h2` and `h3` headings.
- Bullet and numbered lists.
- Links.
- Images with caption/alt.
- Quotes.
- Limited callout/info blocks if needed.

Disallowed rich text:

- Arbitrary HTML.
- Arbitrary colors.
- Custom font sizes.
- Embedded scripts.
- Page-builder layout blocks.

Recommended content types:

- `siteSettings`
- `page`
- `newsPost`
- `project`
- `galleryAlbum`
- `video`
- `person`, only if public team/leadership profiles are needed.

## Hosting And Deployment

Public site hosting: Cloudflare Workers with Workers Assets.

Deployment:

- Cloudflare Git integration deploys from GitHub.
- Production deploys from `main`.
- Preview deploys for branches/PRs where available.
- Sanity publish webhook triggers Cloudflare deploy/build hook.
- Manual deploy fallback documented in setup docs.

Rendering strategy:

- Static/prerendered content by default.
- Fetch Sanity content at build time where possible.
- Avoid runtime Sanity API calls for normal public page views.
- Use hybrid/server behavior only when a future feature requires it.

Analytics:

- Cloudflare Web Analytics for v1.

Infrastructure as code:

- Commit `wrangler.jsonc` as the Cloudflare Worker app config.
- Document Cloudflare dashboard settings in setup docs.
- Do not add Terraform or Alchemy for v1.
- Revisit IaC if the project later adds KV, R2, D1, Queues, scheduled jobs, or multiple Cloudflare environments.

Environment and secrets:

- Commit `.env.example` only.
- Do not commit local `.env` files.
- Store production secrets in Cloudflare and Sanity dashboards.
- Public Sanity project ID/dataset can be exposed.
- Write tokens, deploy hook secrets, and preview tokens stay private.
- Document all environment variables in setup docs.

## Routes

Keep existing routes as canonical for v1 to reduce migration risk:

- `/`
- `/about-us/`
- `/contacts/`
- `/dopomogty/`
- `/gromadska-spilka/`
- `/informatsiia-dlia-zmi/`
- `/novyny/`
- `/pro-nas/`
- `/proekty/`
- `/video/`

Navigation labels:

- `Головна`
- `Про нас`
- `Проєкти`
- `Новини`
- `Галерея`
- `Відео`
- `Як допомогти`
- `Контакти`

If additional current WordPress routes are discovered during migration, preserve them when useful or add explicit redirects.

## Content Strategy

Language:

- Ukrainian-only launch.
- Model content so English can be added later without a major migration.

Migration:

- Manual/selective WordPress migration.
- Keep useful public content.
- Skip demo, stale, duplicate, weak, or irrelevant content.
- Rewrite important pages into stronger structured Ukrainian copy.

Development content:

- Add seed content for local development and examples:
  - homepage
  - core pages
  - 2-3 news posts
  - 2-3 projects
  - 1 gallery album
  - 1-2 videos

Media:

- Store images in Sanity.
- Use Sanity image transformations for sizing/cropping.
- Use real organization media where permitted.
- Embed videos from YouTube/Vimeo or similar external platforms.
- Do not host video files directly in v1.

Donation/help flow:

- Dedicated `/dopomogty/` page.
- Show verified bank/payment/material aid/volunteering/partner instructions.
- No custom payment processing in v1.

Forms:

- No custom forms in v1.
- Use direct email, phone, and social/messenger contact links.

## Accessibility

Target WCAG 2.2 AA where practical:

- Semantic HTML.
- Keyboard navigation.
- Visible focus states.
- Sufficient color contrast.
- CMS fields for image alt text.
- Reduced-motion handling.
- Clear link and button labels.
- No meaning conveyed only through color.

## Ownership

Initial ownership will use the user's personal accounts:

- GitHub.
- Cloudflare.
- Sanity.

The project should still be ready for clean transfer later:

- No hardcoded personal identifiers in code.
- Clear setup documentation.
- Environment variables documented.
- Future ownership-transfer checklist.

## Launch Strategy

Use preview-first launch:

1. Scaffold repository and apps.
2. Configure quality tooling.
3. Configure Sanity schemas and hosted Studio.
4. Build public site with draft/seed content.
5. Connect Sanity content fetching.
6. Deploy preview to Cloudflare.
7. Set up Sanity webhook to trigger Cloudflare rebuilds.
8. Migrate/refine selected content.
9. Verify main routes, SEO basics, accessibility basics, and responsive behavior.
10. Point `pobratymy.com` DNS to Cloudflare only when ready.
11. Keep old WordPress/DNS rollback path available briefly after launch.

## Future Upgrade Path

Consider paid or more advanced services only when there is a real trigger:

- Cloudflare Workers Paid if traffic, dynamic features, or build/deploy limits become an issue.
- Sanity paid plan if content/API/bandwidth/editor needs outgrow Free.
- Draft previews if editors need pre-publish site-level review.
- Terraform or Alchemy if Cloudflare infrastructure grows beyond the Worker app and DNS.
- Unit tests and Playwright once there is meaningful logic or critical interactive behavior.
- Search if the content library becomes large enough to need it.
- Online payments only after legal/accounting/provider requirements are clear.
