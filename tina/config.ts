import { defineConfig } from 'tinacms';
import slugify from 'limax';

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.WORKERS_CI_BRANCH || // Cloudflare Workers Builds
  process.env.CF_PAGES_BRANCH || // Cloudflare Pages
  process.env.HEAD || // Netlify
  'main';

// Astro's convention is the PUBLIC_ prefix; NEXT_PUBLIC_ is kept as a fallback
// for projects that were initialized before the Astro starter switched names.
const clientId = process.env.PUBLIC_TINA_CLIENT_ID || process.env.NEXT_PUBLIC_TINA_CLIENT_ID;

// Blog posts are rendered by Astro content collections in src/data/post and are
// published at the site root (`blog.post.permalink: '/%slug%'` in src/config.yaml).
// Tina uses the same slugify (limax) as src/utils/permalinks.ts so the preview
// iframe opens the right URL.
const blogRouter = ({ document }: { document: { _sys: { filename: string } } }) =>
  `/${slugify(document._sys.filename)}`;

// Portfolio items come from src/data/port and are published under /portfolio,
// see PORTFOLIO_PERMALINK_PATTERN in src/utils/portfolio.ts.
const portfolioRouter = ({ document }: { document: { _sys: { filename: string } } }) =>
  `/portfolio/${slugify(document._sys.filename)}`;

// Static pages (home, solutions/*, services/*, …) keep their content in
// src/data/pages/<route>.json. The file path maps 1:1 to the route, so
// `index.json` → `/` and `solutions/restaurant-food-delivery.json` →
// `/solutions/restaurant-food-delivery`. Tina uses this router to open the
// visual editor at `#/~/<route>`.
const pageRouter = ({ document }: { document: { _sys: { relativePath: string } } }) => {
  const route = document._sys.relativePath.replace(/\.json$/i, '');
  return route === 'index' ? '/' : `/${route}`;
};

// IMPORTANT: every collection below declares its `fields` inline as a literal
// array. Do NOT hoist the array (or any nested field object) into a shared
// `const` and reuse it across collections: Tina mutates field configs in place
// while resolving the schema (adds namespace, uid, …), so a shared object gets
// corrupted and the entry form silently fails to register — the editor then
// shows only "TinaCMS form fields will appear here." Inline literals keep each
// collection independent (this is the pattern the working demo collection uses).

export default defineConfig({
  branch,
  // Get this from tina.io
  clientId,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  // Uncomment to allow cross-origin requests from non-localhost origins
  // during local development (e.g. GitHub Codespaces, Gitpod, Docker).
  // Use 'private' to allow all private-network IPs (WSL2, Docker, etc.)
  // server: {
  //   allowedOrigins: ['https://your-codespace.dev'],
  // },
  media: {
    tina: {
      // The site's real images live in `src/assets/images/` and are referenced
      // as `~/assets/images/…` so Astro optimizes them through `astro:assets`.
      // Point the repo-based media store at that folder: `publicFolder` is
      // relative to the project root and `mediaRoot` is relative to
      // `publicFolder`. Files are then listed from `src/assets/images/` and
      // addressed as `/images/<file>`, which `findImage` maps back to the
      // source asset so the normal `<Image>` pipeline still optimizes them.
      mediaRoot: 'images',
      publicFolder: 'src/assets',
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/r/content-modelling-collections/
  schema: {
    collections: [
      // All blog posts are now `.mdx` (MDX is a superset of Markdown), so one
      // `blogPost` collection covers every post regardless of extension.
      {
        name: 'blogPost',
        label: 'Blog posts',
        path: 'src/data/post',
        format: 'mdx',
        ui: { router: blogRouter },
        fields: [
          { type: 'string', name: 'title', label: 'Title', isTitle: true, required: true },
          { type: 'string', name: 'excerpt', label: 'Excerpt', ui: { component: 'textarea' } },
          { type: 'datetime', name: 'publishDate', label: 'Publish date' },
          { type: 'datetime', name: 'updateDate', label: 'Last updated' },
          { type: 'boolean', name: 'draft', label: 'Draft' },
          {
            type: 'image',
            name: 'image',
            label: 'Cover image',
            description: 'Remote URL or a path such as ~/assets/images/…',
          },
          { type: 'string', name: 'imageAlt', label: 'Cover image alt text' },
          { type: 'string', name: 'category', label: 'Category' },
          { type: 'string', name: 'tags', label: 'Tags', list: true },
          { type: 'string', name: 'author', label: 'Author' },
          {
            type: 'object',
            name: 'metadata',
            label: 'SEO metadata',
            fields: [
              { type: 'string', name: 'canonical', label: 'Canonical URL' },
              { type: 'string', name: 'description', label: 'Meta description' },
              {
                type: 'object',
                name: 'robots',
                label: 'Robots',
                fields: [
                  { type: 'boolean', name: 'index', label: 'Allow indexing' },
                  { type: 'boolean', name: 'follow', label: 'Follow links' },
                ],
              },
              {
                type: 'object',
                name: 'openGraph',
                label: 'Open Graph',
                fields: [
                  { type: 'string', name: 'url', label: 'URL' },
                  { type: 'string', name: 'siteName', label: 'Site name' },
                  { type: 'string', name: 'locale', label: 'Locale' },
                  { type: 'string', name: 'type', label: 'Type' },
                  {
                    type: 'object',
                    name: 'images',
                    label: 'Images',
                    list: true,
                    fields: [
                      { type: 'string', name: 'url', label: 'URL' },
                      { type: 'number', name: 'width', label: 'Width' },
                      { type: 'number', name: 'height', label: 'Height' },
                    ],
                  },
                ],
              },
              {
                type: 'object',
                name: 'twitter',
                label: 'Twitter',
                fields: [
                  { type: 'string', name: 'handle', label: 'Handle' },
                  { type: 'string', name: 'site', label: 'Site' },
                  { type: 'string', name: 'cardType', label: 'Card type' },
                ],
              },
            ],
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
            templates: [
              {
                name: 'YouTube',
                label: 'YouTube embed',
                fields: [{ type: 'string', name: 'id', label: 'Video ID', required: true }],
              },
              {
                name: 'Tweet',
                label: 'Tweet',
                fields: [{ type: 'string', name: 'id', label: 'Tweet URL', required: true }],
              },
              {
                name: 'Vimeo',
                label: 'Vimeo embed',
                fields: [{ type: 'string', name: 'id', label: 'Video ID', required: true }],
              },
            ],
          },
        ],
      },
      // Portfolio / "Our Work". Only .md files exist today, so one collection
      // covers it; add an `.mdx` twin here if MDX projects are ever added.
      {
        name: 'portfolioItem',
        label: 'Portfolio',
        path: 'src/data/port',
        format: 'md',
        ui: { router: portfolioRouter },
        fields: [
          { type: 'string', name: 'title', label: 'Title', isTitle: true, required: true },
          { type: 'string', name: 'excerpt', label: 'Excerpt', ui: { component: 'textarea' } },
          { type: 'datetime', name: 'publishDate', label: 'Publish date' },
          { type: 'datetime', name: 'updateDate', label: 'Last updated' },
          { type: 'boolean', name: 'draft', label: 'Draft' },
          {
            type: 'image',
            name: 'image',
            label: 'Cover image',
            description: 'Remote URL or a path such as ~/assets/images/…',
          },
          { type: 'string', name: 'imageAlt', label: 'Cover image alt text' },
          { type: 'string', name: 'category', label: 'Category' },
          { type: 'string', name: 'tags', label: 'Tags', list: true },
          { type: 'string', name: 'author', label: 'Author' },
          { type: 'string', name: 'client', label: 'Client' },
          { type: 'string', name: 'projectUrl', label: 'Project URL' },
          { type: 'string', name: 'technologies', label: 'Technologies', list: true },
          { type: 'boolean', name: 'featured', label: 'Featured' },
          {
            type: 'object',
            name: 'metadata',
            label: 'SEO metadata',
            fields: [
              { type: 'string', name: 'canonical', label: 'Canonical URL' },
              { type: 'string', name: 'description', label: 'Meta description' },
              {
                type: 'object',
                name: 'robots',
                label: 'Robots',
                fields: [
                  { type: 'boolean', name: 'index', label: 'Allow indexing' },
                  { type: 'boolean', name: 'follow', label: 'Follow links' },
                ],
              },
              {
                type: 'object',
                name: 'openGraph',
                label: 'Open Graph',
                fields: [
                  { type: 'string', name: 'url', label: 'URL' },
                  { type: 'string', name: 'siteName', label: 'Site name' },
                  { type: 'string', name: 'locale', label: 'Locale' },
                  { type: 'string', name: 'type', label: 'Type' },
                  {
                    type: 'object',
                    name: 'images',
                    label: 'Images',
                    list: true,
                    fields: [
                      { type: 'string', name: 'url', label: 'URL' },
                      { type: 'number', name: 'width', label: 'Width' },
                      { type: 'number', name: 'height', label: 'Height' },
                    ],
                  },
                ],
              },
              {
                type: 'object',
                name: 'twitter',
                label: 'Twitter',
                fields: [
                  { type: 'string', name: 'handle', label: 'Handle' },
                  { type: 'string', name: 'site', label: 'Site' },
                  { type: 'string', name: 'cardType', label: 'Card type' },
                ],
              },
            ],
          },
          { type: 'rich-text', name: 'body', label: 'Body', isBody: true },
        ],
      },
      // Static marketing pages. Each page's widget content lives in a JSON file
      // under src/data/pages/, mirroring its route (index.json → /, etc.). The
      // page renders those widgets through PageRenderer so the same data can be
      // edited visually. `widgets` is a superset schema: every widget type picks
      // the fields it needs and ignores the rest.
      {
        name: 'page',
        label: 'Pages',
        path: 'src/data/pages',
        format: 'json',
        ui: { router: pageRouter },
        fields: [
          { type: 'string', name: 'title', label: 'Title', isTitle: true, required: true },
          { type: 'string', name: 'metadataTitle', label: 'SEO title' },
          {
            type: 'object',
            name: 'widgets',
            label: 'Widgets',
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.type ? String(item.type) : 'Widget' }),
            },
            fields: [
              {
                type: 'string',
                name: 'type',
                label: 'Type',
                required: true,
                options: [
                  'hero',
                  'hero2',
                  'heroText',
                  'note',
                  'features',
                  'features2',
                  'features3',
                  'content',
                  'blogLatestPosts',
                  'faqs',
                  'stats',
                  'callToAction',
                  'testimonials',
                  'steps',
                  'steps2',
                  'team',
                  'timeline',
                  'projects',
                  'pricing',
                  'comparison',
                  'bento',
                  'integrations',
                  'brands',
                  'video',
                  'countdown',
                  'socialProof',
                  'quote',
                  'gallery',
                  'featureTabs',
                  'newsletter',
                  'stickyCTA',
                  'contact',
                  'header',
                  'announcement',
                ],
              },
              { type: 'string', name: 'id', label: 'Anchor ID' },
              { type: 'boolean', name: 'isReversed', label: 'Reversed' },
              { type: 'boolean', name: 'isAfterContent', label: 'After content' },
              { type: 'boolean', name: 'isDark', label: 'Dark' },
              { type: 'string', name: 'tagline', label: 'Tagline', ui: { component: 'textarea' } },
              { type: 'string', name: 'badge', label: 'Badge' },
              { type: 'string', name: 'title', label: 'Title', ui: { component: 'textarea' } },
              { type: 'string', name: 'subtitle', label: 'Subtitle', ui: { component: 'textarea' } },
              { type: 'string', name: 'content', label: 'Content (HTML)', ui: { component: 'textarea' } },
              { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
              { type: 'string', name: 'information', label: 'Information (HTML)', ui: { component: 'textarea' } },
              { type: 'string', name: 'bg', label: 'Background (HTML)', ui: { component: 'textarea' } },
              { type: 'string', name: 'linkText', label: 'Link text' },
              { type: 'string', name: 'linkUrl', label: 'Link URL' },
              { type: 'number', name: 'columns', label: 'Columns' },
              { type: 'number', name: 'count', label: 'Count' },
              {
                type: 'object',
                name: 'image',
                label: 'Image',
                fields: [
                  { type: 'string', name: 'src', label: 'Source' },
                  { type: 'string', name: 'alt', label: 'Alt text' },
                  { type: 'string', name: 'aspect', label: 'Aspect ratio' },
                ],
              },
              {
                type: 'string',
                name: 'imageHtml',
                label: 'Image HTML (embed)',
                description: 'Raw HTML for the hero image slot, e.g. a video embed iframe.',
                ui: { component: 'textarea' },
              },
              {
                type: 'object',
                name: 'items',
                label: 'Items',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.title ? String(item.title) : 'Item' }) },
                fields: [
                  { type: 'string', name: 'title', label: 'Title' },
                  { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
                  { type: 'string', name: 'icon', label: 'Icon' },
                  {
                    type: 'object',
                    name: 'image',
                    label: 'Image',
                    fields: [
                      { type: 'string', name: 'src', label: 'Source' },
                      { type: 'string', name: 'alt', label: 'Alt text' },
                    ],
                  },
                  { type: 'string', name: 'href', label: 'Link' },
                  { type: 'string', name: 'linkText', label: 'Link text' },
                  { type: 'number', name: 'span', label: 'Column span (1-3)' },
                  { type: 'number', name: 'rowSpan', label: 'Row span (1-2)' },
                  { type: 'string', name: 'date', label: 'Date' },
                  { type: 'boolean', name: 'highlight', label: 'Highlight' },
                  { type: 'boolean', name: 'ghost', label: 'Ghost (faded)' },
                  { type: 'string', name: 'value', label: 'Value' },
                  { type: 'string', name: 'label', label: 'Label' },
                  { type: 'number', name: 'rating', label: 'Rating (1-5)' },
                  { type: 'string', name: 'color', label: 'Icon color class' },
                  { type: 'string', name: 'result', label: 'Result metric' },
                  { type: 'string', name: 'tags', label: 'Tags', list: true },
                  { type: 'string', name: 'command', label: 'Command' },
                  { type: 'string', name: 'comment', label: 'Comment' },
                  {
                    type: 'object',
                    name: 'callToAction',
                    label: 'Call to action',
                    fields: [
                      { type: 'string', name: 'text', label: 'Text' },
                      { type: 'string', name: 'href', label: 'Link' },
                      { type: 'string', name: 'variant', label: 'Variant' },
                      { type: 'string', name: 'target', label: 'Target' },
                      { type: 'string', name: 'icon', label: 'Icon' },
                    ],
                  },
                ],
              },
              {
                type: 'object',
                name: 'actions',
                label: 'Actions',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.text ? String(item.text) : 'Action' }) },
                fields: [
                  { type: 'string', name: 'text', label: 'Text' },
                  { type: 'string', name: 'href', label: 'Link' },
                  { type: 'string', name: 'variant', label: 'Variant' },
                  { type: 'string', name: 'target', label: 'Target' },
                  { type: 'string', name: 'icon', label: 'Icon' },
                ],
              },
              {
                type: 'object',
                name: 'callToAction',
                label: 'Call to action',
                fields: [
                  { type: 'string', name: 'text', label: 'Text' },
                  { type: 'string', name: 'href', label: 'Link' },
                  { type: 'string', name: 'variant', label: 'Variant' },
                  { type: 'string', name: 'target', label: 'Target' },
                  { type: 'string', name: 'icon', label: 'Icon' },
                ],
              },
              {
                type: 'object',
                name: 'stats',
                label: 'Stats',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.title ? String(item.title) : 'Stat' }) },
                fields: [
                  { type: 'string', name: 'title', label: 'Title' },
                  { type: 'string', name: 'amount', label: 'Amount' },
                ],
              },
              {
                type: 'object',
                name: 'testimonials',
                label: 'Testimonials',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.name ? String(item.name) : 'Testimonial' }) },
                fields: [
                  { type: 'string', name: 'testimonial', label: 'Quote', ui: { component: 'textarea' } },
                  { type: 'string', name: 'name', label: 'Name' },
                  { type: 'string', name: 'job', label: 'Job' },
                  {
                    type: 'object',
                    name: 'image',
                    label: 'Image',
                    fields: [
                      { type: 'string', name: 'src', label: 'Source' },
                      { type: 'string', name: 'alt', label: 'Alt text' },
                    ],
                  },
                ],
              },
              {
                type: 'object',
                name: 'prices',
                label: 'Prices',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.title ? String(item.title) : 'Price' }) },
                fields: [
                  { type: 'string', name: 'title', label: 'Title' },
                  { type: 'string', name: 'subtitle', label: 'Subtitle' },
                  { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
                  {
                    type: 'object',
                    name: 'price',
                    label: 'Price',
                    fields: [
                      { type: 'number', name: 'monthly', label: 'Monthly' },
                      { type: 'number', name: 'yearly', label: 'Yearly' },
                    ],
                  },
                  {
                    type: 'object',
                    name: 'period',
                    label: 'Period',
                    fields: [
                      { type: 'string', name: 'monthly', label: 'Monthly' },
                      { type: 'string', name: 'yearly', label: 'Yearly' },
                    ],
                  },
                  { type: 'string', name: 'note', label: 'Note' },
                  { type: 'boolean', name: 'highlight', label: 'Highlight' },
                  { type: 'boolean', name: 'hasRibbon', label: 'Has ribbon' },
                  { type: 'string', name: 'ribbonTitle', label: 'Ribbon title' },
                  {
                    type: 'object',
                    name: 'items',
                    label: 'Included items',
                    list: true,
                    ui: {
                      itemProps: (item) => ({
                        label: item?.description ? String(item.description).slice(0, 40) : 'Item',
                      }),
                    },
                    fields: [
                      { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
                    ],
                  },
                  {
                    type: 'object',
                    name: 'callToAction',
                    label: 'Call to action',
                    fields: [
                      { type: 'string', name: 'text', label: 'Text' },
                      { type: 'string', name: 'href', label: 'Link' },
                      { type: 'string', name: 'variant', label: 'Variant' },
                      { type: 'string', name: 'target', label: 'Target' },
                      { type: 'string', name: 'icon', label: 'Icon' },
                    ],
                  },
                ],
              },
              {
                type: 'object',
                name: 'comparisonColumns',
                label: 'Comparison columns',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.title ? String(item.title) : 'Column' }) },
                fields: [
                  { type: 'string', name: 'title', label: 'Title' },
                  { type: 'string', name: 'subtitle', label: 'Subtitle' },
                  { type: 'boolean', name: 'highlight', label: 'Highlight' },
                  {
                    type: 'object',
                    name: 'callToAction',
                    label: 'Call to action',
                    fields: [
                      { type: 'string', name: 'text', label: 'Text' },
                      { type: 'string', name: 'href', label: 'Link' },
                      { type: 'string', name: 'variant', label: 'Variant' },
                      { type: 'string', name: 'target', label: 'Target' },
                      { type: 'string', name: 'icon', label: 'Icon' },
                    ],
                  },
                ],
              },
              {
                type: 'object',
                name: 'rows',
                label: 'Comparison rows',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.label ? String(item.label) : 'Row' }) },
                fields: [
                  { type: 'string', name: 'group', label: 'Group' },
                  { type: 'string', name: 'label', label: 'Label' },
                  { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
                  {
                    type: 'string',
                    name: 'values',
                    label: 'Values (one per column: "true", "false" or text)',
                    list: true,
                  },
                ],
              },
              { type: 'string', name: 'firstColumnLabel', label: 'First column label' },
              {
                type: 'object',
                name: 'members',
                label: 'Team members',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.name ? String(item.name) : 'Member' }) },
                fields: [
                  { type: 'string', name: 'name', label: 'Name' },
                  { type: 'string', name: 'role', label: 'Role' },
                  { type: 'string', name: 'bio', label: 'Bio', ui: { component: 'textarea' } },
                  {
                    type: 'object',
                    name: 'image',
                    label: 'Image',
                    fields: [
                      { type: 'string', name: 'src', label: 'Source' },
                      { type: 'string', name: 'alt', label: 'Alt text' },
                    ],
                  },
                ],
              },
              {
                type: 'object',
                name: 'images',
                label: 'Images',
                list: true,
                ui: {
                  itemProps: (item) => ({ label: item?.alt || item?.src ? String(item?.alt || item?.src) : 'Image' }),
                },
                fields: [
                  { type: 'string', name: 'src', label: 'Source' },
                  { type: 'string', name: 'alt', label: 'Alt text' },
                  { type: 'string', name: 'caption', label: 'Caption' },
                  { type: 'string', name: 'href', label: 'Link' },
                ],
              },
              { type: 'string', name: 'icons', label: 'Icons', list: true },
              {
                type: 'object',
                name: 'inputs',
                label: 'Form inputs',
                list: true,
                fields: [
                  { type: 'string', name: 'type', label: 'Type' },
                  { type: 'string', name: 'name', label: 'Name' },
                  { type: 'string', name: 'label', label: 'Label' },
                  { type: 'string', name: 'placeholder', label: 'Placeholder' },
                  { type: 'string', name: 'autocomplete', label: 'Autocomplete' },
                ],
              },
              {
                type: 'object',
                name: 'textarea',
                label: 'Textarea',
                fields: [
                  { type: 'string', name: 'label', label: 'Label' },
                  { type: 'string', name: 'name', label: 'Name' },
                  { type: 'string', name: 'placeholder', label: 'Placeholder' },
                ],
              },
              {
                type: 'object',
                name: 'disclaimer',
                label: 'Disclaimer',
                fields: [{ type: 'string', name: 'label', label: 'Label' }],
              },
              { type: 'string', name: 'src', label: 'Source / video URL' },
              { type: 'string', name: 'youtube', label: 'YouTube ID' },
              { type: 'string', name: 'vimeo', label: 'Vimeo ID' },
              { type: 'string', name: 'poster', label: 'Poster image' },
              { type: 'string', name: 'caption', label: 'Caption' },
              { type: 'string', name: 'videoTitle', label: 'Video title' },
              { type: 'string', name: 'date', label: 'Date (ISO 8601)' },
              { type: 'string', name: 'expiredText', label: 'Expired text' },
              { type: 'string', name: 'quote', label: 'Quote', ui: { component: 'textarea' } },
              { type: 'string', name: 'name', label: 'Name' },
              { type: 'string', name: 'job', label: 'Job' },
              { type: 'number', name: 'rating', label: 'Rating (1-5)' },
              { type: 'string', name: 'variant', label: 'Variant' },
              { type: 'string', name: 'layout', label: 'Layout' },
              { type: 'string', name: 'mode', label: 'Mode' },
              { type: 'string', name: 'orientation', label: 'Orientation' },
              { type: 'boolean', name: 'grayscale', label: 'Grayscale' },
              { type: 'boolean', name: 'boxed', label: 'Boxed' },
              { type: 'boolean', name: 'lightbox', label: 'Lightbox' },
              { type: 'boolean', name: 'collapsible', label: 'Collapsible' },
              { type: 'boolean', name: 'countUp', label: 'Count up' },
              { type: 'boolean', name: 'mobileOnly', label: 'Mobile only' },
              { type: 'number', name: 'showAfter', label: 'Show after (px)' },
              { type: 'string', name: 'method', label: 'Method' },
              { type: 'string', name: 'action', label: 'Form action' },
              { type: 'string', name: 'placeholder', label: 'Placeholder' },
              { type: 'string', name: 'button', label: 'Button label' },
              { type: 'string', name: 'prompt', label: 'Prompt' },
              { type: 'string', name: 'copyLabel', label: 'Copy label' },
              { type: 'string', name: 'copiedLabel', label: 'Copied label' },
              { type: 'string', name: 'note', label: 'Note', ui: { component: 'textarea' } },
              { type: 'string', name: 'result', label: 'Result' },
              { type: 'string', name: 'role', label: 'Role' },
              { type: 'string', name: 'bio', label: 'Bio', ui: { component: 'textarea' } },
              { type: 'string', name: 'currency', label: 'Currency' },
              { type: 'string', name: 'text', label: 'Text' },
              { type: 'string', name: 'href', label: 'Link URL' },
              { type: 'string', name: 'target', label: 'Link target' },
              { type: 'string', name: 'label', label: 'Label' },
              { type: 'boolean', name: 'schema', label: 'Emit structured data (schema)' },
              { type: 'boolean', name: 'isSticky', label: 'Sticky' },
              { type: 'boolean', name: 'isBeforeContent', label: 'Before content' },
              { type: 'string', name: 'position', label: 'Position' },
              {
                type: 'object',
                name: 'classes',
                label: 'Classes (HTML)',
                fields: [
                  { type: 'string', name: 'container', label: 'Container class', ui: { component: 'text' } },
                  { type: 'string', name: 'headline', label: 'Headline class', ui: { component: 'text' } },
                  { type: 'string', name: 'items', label: 'Items class', ui: { component: 'text' } },
                  { type: 'string', name: 'icon', label: 'Icon class', ui: { component: 'text' } },
                ],
              },
              { type: 'string', name: 'container', label: 'Container' },
              { type: 'string', name: 'loading', label: 'Loading' },
              { type: 'boolean', name: 'showToggleTheme', label: 'Show theme toggle' },
              { type: 'string', name: 'defaultIcon', label: 'Default icon' },
              {
                type: 'object',
                name: 'links',
                label: 'Links',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.text ? String(item.text) : 'Link' }) },
                fields: [
                  { type: 'string', name: 'text', label: 'Text' },
                  { type: 'string', name: 'href', label: 'Link' },
                ],
              },
              {
                type: 'object',
                name: 'socials',
                label: 'Social links',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.ariaLabel ? String(item.ariaLabel) : 'Social' }) },
                fields: [
                  { type: 'string', name: 'icon', label: 'Icon' },
                  { type: 'string', name: 'href', label: 'Link' },
                  { type: 'string', name: 'ariaLabel', label: 'Aria label' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
