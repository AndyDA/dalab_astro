# AGENTS.md

DALAB Agency website — dalab.top. Built on [AstroWind](https://github.com/onwidget/astrowind) (Astro 5, Tailwind CSS, TypeScript).

## Commands

```bash
npm install          # first time
npm run dev          # dev server at localhost:4321
npm run build        # static output to dist/
npm run preview      # preview production build

npm run check        # astro check + eslint + prettier (run before commits)
npm run fix          # auto-fix eslint + prettier
```

CI uses `npm ci --legacy-peer-deps` — if `npm install` has peer dep conflicts, that flag is expected.

## Project Structure

- `src/pages/` — routes. File path = URL path (e.g. `src/pages/services/web-design.astro` → `/services/web-design`).
- `src/components/widgets/` — reusable page sections (Hero, Features, Content, etc.). Pages compose these.
- `src/components/ui/` — low-level UI primitives (Button, ItemGrid, etc.).
- `src/data/post/` — blog posts (Markdown/MDX).
- `src/data/port/` — portfolio items (Markdown/MDX).
- `src/content.config.ts` — Zod schemas for blog and portfolio collections.
- `src/config.yaml` — site-wide config (SEO, blog settings, analytics, theme).
- `src/navigation.ts` — header and footer nav structure.
- `vendor/integration/` — custom AstroWind integration (reads config.yaml, generates virtual `astrowind:config` module, patches robots.txt with sitemap URL after build).

## Conventions

- **Path alias:** `~/` maps to `src/` (both in imports and tsconfig).
- **Components:** Build pages by composing widgets from `src/components/widgets/`.
- **Content:** Add blog posts in `src/data/post/`, portfolio in `src/data/port/`. Define schemas in `src/content/config.ts` (actually `src/content.config.ts`) if adding new collections.
- **Icons:** Use `<Icon>` from `astro-icon/components`. Available sets: `tabler`, `flat-color-icons`.
- **Styling:** Tailwind CSS utility classes. Scoped styles in `<style>` tags. Global overrides in `src/assets/styles/tailwind.css`.
- **Prettier:** 120 chars, single quotes, semicolons on, trailing commas (es5). See `.prettierrc.cjs`.
- **ESLint:** Astro + TypeScript rules. Unused vars must be prefixed with `_`.
- **Dark mode:** Toggled via `class` strategy.

## Adding New Pages

1. Create an `.astro` file under `src/pages/` at the desired URL path.
2. Import and compose widget components.
3. Add nav entry in `src/navigation.ts` (headerData or footerData).

## Adding Content (Blog/Portfolio)

1. Create a `.md` or `.mdx` file in `src/data/post/` or `src/data/port/`.
2. Frontmatter must match the schema in `src/content.config.ts` (title, publishDate, excerpt, image, category, tags, etc.).
3. Blog uses `post` collection; portfolio uses `port` collection.

## Build Output

Static site generated in `dist/`. Deployed to GitHub Pages via `.github/workflows/deploy.yml`. Also has Docker/Nginx config and Netlify/Vercel configs but primary deployment is GitHub Pages.

## Gotchas

- The site URL in `astro.config.ts` is `https://andyda.github.io` — verify this is intentional vs `dalab.top` (which is in `src/config.yaml`).
- `vendor/` is a local package, not npm. Do not delete or overwrite without understanding the integration.
- `sharp` is pinned at `0.34.1` in devDependencies. The `allowScripts` block in package.json enables it.
- `--legacy-peer-deps` is required in CI for `npm ci`.
