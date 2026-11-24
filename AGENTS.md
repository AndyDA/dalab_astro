# 🚀 Agent Instructions

## 🛠 Commands

- **Dev**: `npm run dev`
- **Check**: `npm run check` (astro, eslint, prettier)
- **Fix**: `npm run fix` (eslint, prettier)
- **Build**: `npm run build`

## ⚙️ Configuration & Styling

- **Settings**: `src/config.yaml`
- **Tailwind v4**: CSS-first. Customizations in `src/assets/styles/tailwind.css`.
- **Design Tokens**: Managed in `src/components/CustomStyles.astro` and `src/assets/styles/shadcn.css`.
- **Aliases**: `~` -> `src/`

## 📂 Structure

- **Components**: `src/components/` (Widgets in `src/components/widgets/`)
- **Content**: `src/data/post/` (.md/.mdx)
- **Pages**: `src/pages/`
- **Layouts**: `src/layouts/`

## ⚠️ Critical Quirks

- **Compression**: `astro-compress` uses `lightningcss` (NOT `csso`) to support Tailwind v4 media queries.
- **Code Themes**: Shiki uses `github-light` and `github-dark`.

## 🧠 Skills

Detailed guides in `.agents/skills/` — read the relevant one before starting.

| Skill                       | Description                                               |
| --------------------------- | --------------------------------------------------------- |
| `add-blog-post.md`          | Creating blog posts with required frontmatter             |
| `add-component.md`          | Building new widget components with TypeScript interfaces |
| `add-page.md`               | Creating new pages using PageLayout                       |
| `add-structured-data.md`    | Adding JSON-LD structured data                            |
| `configure-contact-form.md` | Connecting forms to backends (Netlify, Formspree)         |
| `content-at-build-time.md`  | Content collection build-time behavior                    |
| `customize-header.md`       | Header props, breakpoints, sticky behavior                |
| `deploy-cloudflare.md`      | Deploying to Cloudflare Pages/Workers                     |
| `deploy-with-base-path.md`  | Deploying under sub-paths (GitHub Pages)                  |
| `disable-blog.md`           | Disabling the blog feature                                |
| `set-open-graph-image.md`   | Configuring OG/social share images                        |
| `setup-decap-cms.md`        | Decap CMS setup on Netlify                                |
| `styling.md`                | Tailwind v4 CSS-first configuration                       |
| `use-shadcn-tokens.md`      | Using shadcn/ui CSS variables                             |
| `use-widgets.md`            | Catalogue of all widget components                        |
| `write-landing-page.md`     | Writing landing pages                                     |
| `frontend-design/SKILL.md`  | Visual design guidance for non-templated UI               |

### Task → Skill mapping

- **Adding a blog post** → read `add-blog-post.md`
- **Creating a new component** → read `add-component.md`
- **Adding a new page** → read `add-page.md`
- **Adding structured data** → read `add-structured-data.md`
- **Configuring contact form** → read `configure-contact-form.md`
- **Understanding build behavior** → read `content-at-build-time.md`
- **Customizing the header** → read `customize-header.md`
- **Deploying to Cloudflare** → read `deploy-cloudflare.md`
- **Deploying with base path** → read `deploy-with-base-path.md`
- **Disabling the blog** → read `disable-blog.md`
- **Setting OG images** → read `set-open-graph-image.md`
- **Setting up Decap CMS** → read `setup-decap-cms.md`
- **Styling / Tailwind v4** → read `styling.md`
- **Using shadcn tokens** → read `use-shadcn-tokens.md`
- **Using widgets** → read `use-widgets.md`
- **Writing a landing page** → read `write-landing-page.md`
- **Frontend design decisions** → read `frontend-design/SKILL.md`
