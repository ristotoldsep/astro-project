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

## Content Management (CMS)

Content is managed via **Decap CMS** at `https://qinutritionist.com/admin/`.

### Accessing the CMS

1. Go to `https://qinutritionist.com/admin/`
2. Click **Login with GitHub**
3. Authorize the **QiNutritionist CMS** OAuth app

Only GitHub users who are **collaborators on this repository** with write access can save changes.

### How it works

- Edits made in the CMS are committed directly to the `main` branch on GitHub
- Each save triggers the GitHub Actions deploy pipeline automatically
- The site is live on `https://qinutritionist.com` within ~2 minutes of saving

### CMS infrastructure

| Component | Details |
|-----------|---------|
| CMS | [Decap CMS](https://decapcms.org) — config at `public/admin/config.yml` |
| OAuth proxy | Cloudflare Worker (URL in project notes) |
| Admin UI | Served as static files at `public/admin/` |

### Editable content

The CMS covers all three languages (English, Estonian, Spanish) for:

- **Home Page** — hero, welcome text, pillars, services preview, quote, events banner, free guide
- **Services Page** — individual session cards (title, price, features), 3-month program cards
- **Events Page** — all headings, paragraphs, feature lists, CTA buttons for Barcelona & Tallinn
- **About Page** — bio paragraphs, three pillars, quote

### Adding new CMS fields

If new translatable content is added to `src/i18n/*.json`, mirror it in `public/admin/config.yml` under the appropriate collection using the same key name as a `name:` field.

---

## Deployment

Deployment is fully automated via **GitHub Actions** (`.github/workflows/deploy.yml`).

Every push to `main` triggers:
1. `npm ci && npm run build`
2. `rsync dist/` to the Zone.ee Apache server at `paavli.ee` via SSH

### SSH deploy key

The GitHub Actions pipeline authenticates with the server using a dedicated SSH key stored as the `DEPLOY_KEY` repository secret.

### PHP contact form

`public/mail.php` must be served by a PHP runtime on the target server. Update inside the file:

- `RECIPIENT_EMAIL`
- `ALLOWED_ORIGINS`
