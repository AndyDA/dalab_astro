import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import type { RehypePlugin, RemarkPlugin } from '@astrojs/markdown-remark';

export const readingTimeRemarkPlugin: RemarkPlugin = () => {
  return function (tree, file) {
    const textOnPage = toString(tree);
    const readingTime = Math.ceil(getReadingTime(textOnPage).minutes);

    if (typeof file?.data?.astro?.frontmatter !== 'undefined') {
      file.data.astro.frontmatter.readingTime = readingTime;
    }
  };
};

export const responsiveTablesRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    if (!tree.children) return;

    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i];

      if (child.type === 'element' && child.tagName === 'table') {
        tree.children[i] = {
          type: 'element',
          tagName: 'div',
          properties: {
            style: 'overflow:auto',
          },
          children: [child],
        };

        i++;
      }
    }
  };
};

/** Minimal mdast shape needed to rewrite image URLs. */
type MdastNode = { type?: string; url?: string; children?: MdastNode[] };

const LOCAL_IMAGE_EXTENSIONS = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.tiff', '.webp']);

const isLocalImage = (url: string) =>
  LOCAL_IMAGE_EXTENSIONS.has(path.extname(url.split('#')[0].split('?')[0]).toLowerCase());

/**
 * Resolve Obsidian/Vault CMS relative image paths to a `~/…` path so Astro's
 * asset pipeline can optimize them.
 *
 * Vault CMS stores attachments in an `attachments/` subfolder next to the note
 * (`.obsidian/app.json` → `attachmentFolderPath: "./attachments"`) and writes
 * them with Obsidian's relative link format, e.g. `![](attachments/diagram.png)`.
 * Astro cannot resolve those as-is, so they are rewritten to `~/data/<…>` — the
 * form `findImage` in `~/utils/images` resolves through `import.meta.glob`.
 *
 * Absolute paths, `~`/`/` references, remote URLs and files that do not exist
 * are left untouched.
 */
export const resolveAttachmentsRemarkPlugin: RemarkPlugin = () => {
  return function (tree, file) {
    const rawPath = file?.path ?? file?.history?.[0];
    if (!rawPath) return;

    const notePath = rawPath.startsWith('file://') ? fileURLToPath(rawPath) : rawPath;
    const noteDir = path.dirname(notePath);
    const projectRoot = process.cwd();

    const walk = (node: MdastNode) => {
      if (node.type === 'image' && typeof node.url === 'string' && node.url) {
        const url = node.url;
        const isRemote = /^(https?:)?\/\//.test(url);
        const isSpecial = url.startsWith('/') || url.startsWith('~') || url.startsWith('#');

        if (!isRemote && !isSpecial && isLocalImage(url)) {
          const decoded = decodeURIComponent(url.split('#')[0].split('?')[0]);
          const absolute = path.resolve(noteDir, decoded);
          const relative = path.relative(projectRoot, absolute).replace(/\\/g, '/');

          // Only rewrite files that actually live under `src/` (the `~` alias).
          if (relative.startsWith('src/') && fs.existsSync(absolute)) {
            node.url = `~/${relative.slice('src/'.length)}`;
          }
        }
      }

      if (Array.isArray(node.children)) node.children.forEach(walk);
    };

    walk(tree as unknown as MdastNode);
  };
};
