// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://hondasan.github.io',
  base: '/pm_study',
  integrations: [sitemap()]
});