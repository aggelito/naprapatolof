import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://aggelito.github.io',
  base: '/naprapatolof',
  integrations: [sitemap()],
});
