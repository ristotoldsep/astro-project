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
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US', et: 'et-EE', es: 'es-ES' },
      },
    }),
  ],
  output: 'static',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'et', 'es'],
    routing: {
      prefixDefaultLocale: false,   // / = English, /et = Estonian, /es = Spanish
    },
  },
});
