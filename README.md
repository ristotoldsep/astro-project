# QiNutritionist Website

Marketing website for **QiNutritionist**, built with Astro and localized in English, Estonian, and Spanish.

## Tech Stack

- **Framework:** Astro 5 (static output)
- **Language:** TypeScript (Astro + TS config)
- **Styling:** SCSS + Tailwind utilities (`@astrojs/tailwind`)
- **SEO:** `@astrojs/sitemap` + per-page meta/OG + JSON-LD in layout
- **Assets:** Astro image pipeline (`astro:assets`) with AVIF/WebP generation
- **Form backend:** PHP mail handler served from `public/mail.php`

## Project Structure

```text
site/
  astro.config.mjs
  package.json
  public/
    images/
    videos/
    mail.php
  src/
    assets/images/
    components/
    i18n/
      en.json
      et.json
      es.json
      utils.ts
    layouts/
      BaseLayout.astro
    pages/
      index.astro
      about.astro
      services.astro
      events.astro
      consultation.astro
      et/
      es/
    styles/
      global.scss
```

## Internationalization

Configured in `astro.config.mjs`:

- Locales: `en` (default), `et`, `es`
- Default locale is **not prefixed** (`/` is English)
- Estonian and Spanish are prefixed (`/et`, `/es`)

Custom route localization is handled in `src/i18n/utils.ts`:

- Canonical slugs are mapped to localized slugs (e.g. `/about` → `/minust` in ET, `/sobre-mi` in ES)
- Reverse mappings are used for language switching
- Trailing slash normalization is applied to avoid locale switch mismatches

## Available Scripts

From the `site` directory:

- `npm run dev` – start local dev server
- `npm run build` – create production static build in `dist/`
- `npm run preview` – preview the production build locally

## Getting Started

1. Install dependencies:
   - `npm install`
2. Start development:
   - `npm run dev`
3. Open the local URL shown in terminal.

## Contact Form (`public/mail.php`)

The frontend contact form posts to `public/mail.php`, which:

- Accepts `POST` `multipart/form-data`
- Validates required fields (`name`, `email`, `interest`)
- Uses a honeypot field (`website`) for bot filtering
- Restricts allowed origins via `ALLOWED_ORIGINS`
- Sends email via native PHP `mail()`

### Important configuration

Inside `public/mail.php` update as needed:

- `RECIPIENT_EMAIL`
- `ALLOWED_ORIGINS`

For production hosting, use an environment with PHP + `mail()` support (or replace this endpoint with your transactional email provider/API).

## SEO Notes

- Global metadata and structured data are defined in `src/layouts/BaseLayout.astro`
- Locale-aware fallback descriptions and JSON-LD strings are sourced from `src/i18n/*.json`
- Sitemap with i18n alternates is generated during `npm run build`

## Deployment

This project builds to static files (`output: 'static'`).

Typical deployment flow:

1. `npm run build`
2. Upload `dist/` contents to your host
3. Ensure `mail.php` is served by PHP runtime on the target server

If deploying to a pure static host (no PHP), move form handling to a serverless/API endpoint.
