import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://aggelito.github.io',
  base: '/naprapatolof',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
