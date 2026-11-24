// TinaCMS Admin dark-mode patcher.
//
// Cross-platform port of the bash gist `elisenovakilo/patch-tina-darkmode.sh`.
// TinaCMS overwrites the generated `admin/index.html` on every dev/build, so the
// gist re-injects a dark palette after each generation. Here the same CSS is
// injected by an Astro integration in `astro.config.ts`:
//   - dev   → a Vite middleware serves the patched admin HTML on the fly
//   - build → an `astro:build:done` hook patches `dist/admin/index.html`
//
// The colours below are a dark-purple theme; tweak them to taste.

export const DARK_MODE_MARKER = 'Force dark mode for TinaCMS UI';

export const DARK_CSS = String.raw`html, body, #root {
  background: #18181b;
  color: #f3f4f6;
}
div .h-dvh {
  background: #0e050e;
}
div .h-dvh.pointer-events-none{
  background: unset;
}
.text-gray-400 {
  color: #87838a;
}
.text-gray-500 {
  color: #b6b1b8;
}
.text-gray-600 {
  color: #c7c3ca;
}
.text-gray-700 {
  color: #c3bfc5;
}
.text-gray-800 {
  color: #d9d3da;
}
.text-gray-900 {
  color: #f0f0f0;
}
.focus\:text-gray-900:focus {
  color: #f0f0f0;
}
.bg-white {
  background-color: #100c11;
}
.bg-gray-50 {
  background-color: #18121a;
}
.bg-gray-100 {
  background-color: #1b141d;
}
textarea {
  background-color: #0d090e;
}
.to-yellow-100 {
  --tw-gradient-to: #4d491f var(--tw-gradient-to-position);
}
.from-yellow-50 {
  --tw-gradient-from: #3f3c19 var(--tw-gradient-from-position);
  --tw-gradient-to: rgba(0, 0, 0, 0.85) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.to-gray-50 {
  --tw-gradient-to: #181718 var(--tw-gradient-to-position);
}
.from-gray-50\/50 {
  --tw-gradient-from: rgba(34, 33, 34, 0.5) var(--tw-gradient-from-position);
  --tw-gradient-to: rgba(41, 40, 41, 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.from-white {
  --tw-gradient-from: #1b1423 var(--tw-gradient-from-position);
  --tw-gradient-to: rgba(7, 7, 7, 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.bg-blue-500 {
  background-color: rgb(0 132 255);
}`;

/**
 * Inject the dark-mode stylesheet into an admin `index.html` string.
 * Idempotent: returns the input unchanged if it is already patched.
 */
export function injectDarkMode(html: string): string {
  if (typeof html !== 'string' || html.includes(DARK_MODE_MARKER)) return html;

  const style = `<style>\n/* ${DARK_MODE_MARKER} */\n${DARK_CSS}\n</style>`;
  const anchor = '<div id="root"></div>';

  if (html.includes(anchor)) return html.replace(anchor, `${anchor}\n${style}`);
  if (html.includes('</body>')) return html.replace('</body>', `${style}\n</body>`);
  return `${html}\n${style}`;
}
