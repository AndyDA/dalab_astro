// Astro content-collection entries expose an `id` (the file name without its
// extension), but Tina addresses documents by their `relativePath` (the file
// name *with* extension, e.g. `build-websites-with-ai.md`). Vite's
// `import.meta.glob` gives us the real file names at build time so we can map
// one to the other without touching the filesystem directly.

const stripExt = (value: string) => value.replace(/\.(md|mdx)$/i, '');

const buildMap = (files: Record<string, unknown>): Record<string, string> => {
  const map: Record<string, string> = {};
  for (const key of Object.keys(files)) {
    const fileName = key.split('/').pop();
    if (!fileName) continue;
    // Key by the extension-less id so callers can pass either `post.id` or a
    // full file name.
    map[stripExt(fileName)] = fileName;
  }
  return map;
};

const postFiles = import.meta.glob('/src/data/post/*.{md,mdx}');
const portFiles = import.meta.glob('/src/data/port/*.{md,mdx}');

const postMap = buildMap(postFiles);
const portMap = buildMap(portFiles);

export type TinaCollectionKind = 'post' | 'port';

/** Resolve a content-collection `id` to a Tina `relativePath` (with extension). */
export function resolveRelativePath(kind: TinaCollectionKind, id: string): string | undefined {
  const map = kind === 'post' ? postMap : portMap;
  return map[stripExt(id)] ?? map[id];
}