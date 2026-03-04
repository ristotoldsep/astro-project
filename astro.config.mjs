import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://qinutritionist.com',
  integrations: [
    tailwind({
      // Don't inject Tailwind's base reset — our custom SCSS reset takes over
      applyBaseStyles: false,
    }),
    sitemap(),
  ],
  output: 'static',
  trailingSlash: 'ignore',
});
