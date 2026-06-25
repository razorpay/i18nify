import { withErrorBoundary } from '../../common/errorBoundary';

type ResolveLocaleOptions = {
  /** localStorage key to check. Default: 'i18nify-locale' */
  storageKey?: string;
  /** Explicit locale preference — the "options" layer. */
  locale?: string;
  /** Returned when all higher-priority signals are absent. Default: 'en' */
  fallbackLocale?: string;
};

/**
 * Resolves a BCP 47 locale string by walking a four-level priority chain:
 *
 *   1. **storage** — `localStorage.getItem(storageKey)` (client only)
 *   2. **options** — the explicit `locale` field
 *   3. **browser** — `navigator.languages[0]` / `navigator.language` (client only)
 *   4. **fallback** — `fallbackLocale` (default `'en'`)
 *
 * Each level is skipped if its value is empty/whitespace or unavailable.
 * The function is synchronous and never throws — it always returns a string.
 *
 * @example
 * // localStorage has 'i18nify-locale' = 'fr-FR'
 * resolveLocale()                                  // → 'fr-FR'
 *
 * // no storage, explicit locale passed
 * resolveLocale({ locale: 'de-DE' })               // → 'de-DE'
 *
 * // no storage, no explicit locale, browser says 'pt-BR'
 * resolveLocale()                                  // → 'pt-BR'
 *
 * // SSR / no browser APIs, custom fallback
 * resolveLocale({ fallbackLocale: 'en-US' })       // → 'en-US'
 */
const resolveLocale = (options: ResolveLocaleOptions = {}): string => {
  const {
    storageKey = 'i18nify-locale',
    locale,
    fallbackLocale = 'en',
  } = options;

  // Priority 1: storage (localStorage, client environments only)
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = window.localStorage.getItem(storageKey);
    if (stored?.trim()) return stored.trim();
  }

  // Priority 2: options (explicitly passed locale)
  if (locale?.trim()) return locale.trim();

  // Priority 3: browser (navigator.languages / navigator.language)
  if (typeof window !== 'undefined' && window.navigator) {
    const browserLocale =
      window.navigator.languages?.[0] || window.navigator.language;
    if (browserLocale?.trim()) return browserLocale.trim();
  }

  // Priority 4: fallback
  return fallbackLocale?.trim() || 'en';
};

export default withErrorBoundary<typeof resolveLocale>(resolveLocale);
