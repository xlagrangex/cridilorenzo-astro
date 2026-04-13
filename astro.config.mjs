// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://cridilorenzo.com',
  adapter: vercel(),
  integrations: [react(), sitemap()],
  trailingSlash: "ignore",

  vite: {
    plugins: [tailwindcss()]
  }
});
