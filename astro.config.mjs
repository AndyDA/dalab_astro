import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://andyda.github.io',
  base: '/astro_dart',
  integrations: [tailwind()]
});