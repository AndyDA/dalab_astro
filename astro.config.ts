import path from 'path';
import fs from 'node:fs';
import { fileURLToPath } from 'url';

import { defineConfig, fontProviders } from 'astro/config';
import type { Plugin } from 'vite';

import { unified } from '@astrojs/markdown-remark';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import tina from '@tinacms/astro/integration';
import { tinaAdminDevRedirect } from '@tinacms/astro/vite';
import type { AstroIntegration } from 'astro';

import astrowind from './vendor/integration';

import { readingTimeRemarkPlugin, resolveAttachmentsRemarkPlugin, responsiveTablesRehypePlugin } from './src/utils/frontmatter';
import { injectDarkMode } from './scripts/tina-darkmode';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// TinaCMS's visual-editing endpoint (`/tina-island/*`) renders on demand, so
// the site needs an SSR adapter even though every page is prerendered. Detect
// the host from the environment it exposes and fall back to a portable Node
// server (used by Docker and plain `astro preview`). Set DEPLOY_ADAPTER to
// force one: 'vercel' | 'netlify' | 'cloudflare' | 'node'.
async function getAdapter() {
  const vercel = async () => (await import('@astrojs/vercel')).default();
  const netlify = async () => (await import('@astrojs/netlify')).default();
  const cloudflare = async () => (await import('@astrojs/cloudflare')).default();
  const nodeStandalone = async () => (await import('@astrojs/node')).default({ mode: 'standalone' });

  switch (process.env.DEPLOY_ADAPTER) {
    case 'vercel':
      return vercel();
    case 'netlify':
      return netlify();
    case 'cloudflare':
      return cloudflare();
    case 'node':
      return nodeStandalone();
    case undefined:
      break;
    default:
      console.warn(`[astro.config] Unknown DEPLOY_ADAPTER "${process.env.DEPLOY_ADAPTER}" — auto-detecting instead.`);
  }

  if (process.env.VERCEL) return vercel();
  // WORKERS_CI = Cloudflare Workers Builds, CF_PAGES = Cloudflare Pages CI.
  if (process.env.WORKERS_CI || process.env.CF_PAGES) return cloudflare();
  if (process.env.NETLIFY) return netlify();

  return nodeStandalone();
}

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

// Dev-only middleware: serve `/images/*` from `src/assets/images` so the
// TinaCMS Media Manager can render thumbnails for repo-based media. Uploads are
// stored in `src/assets/images/` (see `media.tina` in tina/config.ts) and
// addressed as `/images/<file>`; in production those references are resolved by
// `findImage` through Astro's asset pipeline, so this only affects `astro dev`.
const TINA_MEDIA_MIME: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const serveTinaMediaImages = (): Plugin => {
  const root = path.resolve(__dirname, 'src/assets/images');
  return {
    name: 'serve-tina-media-images',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/images/')) return next();
        const rel = decodeURIComponent(req.url.split('?')[0].slice('/images/'.length));
        const filePath = path.resolve(root, rel);
        if (!filePath.startsWith(root + path.sep) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
          res.statusCode = 404;
          res.end('Not found');
          return;
        }
        res.setHeader(
          'Content-Type',
          TINA_MEDIA_MIME[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream'
        );
        fs.createReadStream(filePath).pipe(res);
      });
    },
  };
};

// TinaCMS overwrites the generated admin `index.html` on every dev/build, so the
// dark palette has to be (re)applied each time. In dev a Vite middleware serves
// the patched HTML on the fly; for `astro build` an `astro:build:done` hook
// patches `dist/admin/index.html`. See `scripts/tina-darkmode.ts`.
const tinaAdminDarkMode = (): AstroIntegration => {
  const devAdminIndexPath = path.resolve(__dirname, 'public/admin/index.html');
  return {
    name: 'tina-admin-dark-mode',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [
              {
                name: 'tina-admin-dark-mode-dev',
                apply: 'serve',
                configureServer(server) {
                  server.middlewares.use(async (req, res, next) => {
                    const urlPath = (req.url || '').split('?')[0];
                    if ((req.method === 'GET' || req.method === 'HEAD') && urlPath === '/admin/index.html') {
                      try {
                        const html = await fs.promises.readFile(devAdminIndexPath, 'utf8');
                        res.setHeader('Content-Type', 'text/html; charset=utf-8');
                        res.end(req.method === 'HEAD' ? undefined : injectDarkMode(html));
                        return;
                      } catch {
                        /* fall through to Astro's static serving */
                      }
                    }
                    next();
                  });
                },
              },
            ],
          },
        });
      },
      'astro:build:done': async ({ dir }) => {
        const file = path.join(fileURLToPath(dir), 'admin', 'index.html');
        try {
          const html = await fs.promises.readFile(file, 'utf8');
          const patched = injectDarkMode(html);
          if (patched !== html) {
            await fs.promises.writeFile(file, patched);
            console.info('[tina-admin-dark-mode] Injected dark mode into dist/admin/index.html');
          }
        } catch {
          /* admin build not present (e.g. plain `astro build` without Tina) */
        }
      },
    },
  };
};

export default defineConfig({
  site: 'https://dalab.top',
  output: 'static',
  adapter: await getAdapter(),

  // Prefetch links as they enter the viewport for snappier navigations
  // (works together with <ClientRouter />, which enables prefetch by default).
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  // Native Fonts API: self-hosts + subsets + preloads Inter and generates
  // metric-adjusted fallbacks. Injected via <Font /> in Layout.astro and
  // consumed through the `--font-inter` CSS variable in CustomStyles.astro.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
  ],

  integrations: [
    sitemap(),
    mdx(),
    icon({
      // Local SVG icons (used as <Icon name="file-name" />) live next to the other assets.
      iconDir: 'src/assets/icons',
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      // csso off on purpose: its parser doesn't understand the media range
      // syntax Tailwind v4 emits for breakpoints (`@media (width>=48rem)`) and
      // silently drops every one of those blocks — the site then renders as if
      // all `md:`/`lg:` classes were missing. lightningcss parses it correctly.
      CSS: { csso: false, lightningcss: { minify: true } },
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),

    // TinaCMS: wires the visual-editing middleware and the /admin/bridge.js
    // asset. Must stay after the integrations above that transform HTML.
    tina(),

    // Forces a dark palette onto the TinaCMS admin UI (dev + build).
    tinaAdminDarkMode(),
  ],

  image: {
    domains: ['cdn.pixabay.com', 'images.unsplash.com'],
    responsiveStyles: true,
    dangerouslyProcessSVG: true,
  },

  markdown: {
    processor: unified({
      remarkPlugins: [readingTimeRemarkPlugin, resolveAttachmentsRemarkPlugin],
      rehypePlugins: [responsiveTablesRehypePlugin],
    }),
    shikiConfig: {
      // Code blocks follow the site theme; see the `.astro-code` rules in tailwind.css.
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },

  vite: {
    plugins: [tailwindcss(), tinaAdminDevRedirect(), serveTinaMediaImages()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
    ssr: {
      // Bundle Tina's Astro components into the SSR build instead of resolving
      // the package's .astro sources on every island re-render.
      noExternal: ['@tinacms/astro', '@tinacms/bridge'],
    },
  },
});
