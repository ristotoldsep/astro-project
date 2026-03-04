import en from './en.json';
import et from './et.json';
import es from './es.json';

export type Locale = 'en' | 'et' | 'es';

const translations = { en, et, es } as const;

/** Canonical slug → localized URL slug for each non-English locale */
const slugMap: Record<Locale, Record<string, string>> = {
  en: {},
  et: {
    '/about':        '/minust',
    '/services':     '/teenused',
    '/events':       '/uritused',
    '/consultation': '/noustamine',
  },
  es: {
    '/about':        '/sobre-mi',
    '/services':     '/servicios',
    '/events':       '/eventos',
    '/consultation': '/consulta',
  },
};

/** Localized URL slug → canonical slug (reverse of slugMap) */
const reverseSlugMap: Record<Locale, Record<string, string>> = {
  en: {},
  et: {
    '/minust':      '/about',
    '/teenused':    '/services',
    '/uritused':    '/events',
    '/noustamine':  '/consultation',
  },
  es: {
    '/sobre-mi':  '/about',
    '/servicios': '/services',
    '/eventos':   '/events',
    '/consulta':  '/consultation',
  },
};

/**
 * Returns a translation accessor `t(key)` for the given locale.
 * Dot-notation keys traverse the nested JSON (e.g. "nav.home").
 * Falls back to English when a key is missing in the requested locale.
 */
export function useTranslations(lang: Locale) {
  const dict = translations[lang] ?? translations.en;
  const fallback = translations.en;

  function t(key: string): any {
    const keys = key.split('.');
    // Try the requested locale first, then fall back to English.
    let val: any = dict;
    for (const k of keys) {
      if (val == null || typeof val !== 'object') { val = undefined; break; }
      val = (val as Record<string, unknown>)[k];
    }
    if (val !== undefined) return val;

    let fb: any = fallback;
    for (const k of keys) {
      if (fb == null || typeof fb !== 'object') { fb = undefined; break; }
      fb = (fb as Record<string, unknown>)[k];
    }
    return fb ?? key;
  }

  return t;
}

/**
 * Builds a locale-prefixed URL path.
 * English (default) has no prefix: "/" → "/"
 * Other locales prefix with "/et" or "/es": "/" → "/et"
 */
/** Strip trailing slash unless the path is exactly "/". */
function normalizeSlug(slug: string): string {
  return slug.length > 1 ? slug.replace(/\/$/, '') : slug;
}

export function getLocalePath(lang: Locale, slug: string): string {
  const normalized = normalizeSlug(slug);
  const localized = slugMap[lang][normalized] ?? normalized;
  if (lang === 'en') return localized;
  const clean = localized === '/' ? '' : localized;
  return `/${lang}${clean}`;
}

/**
 * Detects the current locale from a URL pathname.
 * Returns { lang, slug } where slug is the path without the locale prefix.
 */
export function detectLocale(pathname: string): { lang: Locale; slug: string } {
  if (pathname.startsWith('/et')) {
    const localSlug = normalizeSlug(pathname.replace(/^\/et/, '') || '/');
    const slug = reverseSlugMap.et[localSlug] ?? localSlug;
    return { lang: 'et', slug };
  }
  if (pathname.startsWith('/es')) {
    const localSlug = normalizeSlug(pathname.replace(/^\/es/, '') || '/');
    const slug = reverseSlugMap.es[localSlug] ?? localSlug;
    return { lang: 'es', slug };
  }
  return { lang: 'en', slug: normalizeSlug(pathname) };
}

/** All supported locales in order. */
export const locales: Locale[] = ['en', 'et', 'es'];

/** Human-readable locale labels. */
export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  et: 'ET',
  es: 'ES',
};
