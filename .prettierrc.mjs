/** @type {import('prettier').Config} */
export default {
  printWidth: 120,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
  // Respect the line endings already in the file (CRLF on Windows checkouts)
  // instead of forcing LF, which makes `--check` fail locally on Windows.
  endOfLine: 'auto',

  plugins: ['prettier-plugin-astro'],

  overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
};
