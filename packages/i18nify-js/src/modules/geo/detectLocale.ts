import { withErrorBoundary } from '../../common/errorBoundary';
import { CountryCodeType } from '../types';
import { I18NIFY_DATA_SOURCE } from '../shared';
import { CountryMetaType } from './types';

type DetectLocaleOptions = {
  countryCode?: CountryCodeType;
  currency?: string;
  acceptLanguage?: string;
  browserLocale?: string;
};

// Parses RFC 7231 Accept-Language header, returns highest-priority locale tag.
const parseAcceptLanguage = (header: string): string | null => {
  const entries = header
    .split(',')
    .map((part) => {
      const [raw, q] = part.trim().split(';q=');
      const locale = raw.trim();
      return { locale, q: q !== undefined ? parseFloat(q) : 1.0 };
    })
    .filter(({ locale }) => locale.length > 0 && locale !== '*');

  if (entries.length === 0) return null;
  entries.sort((a, b) => b.q - a.q);
  return entries[0].locale;
};

/**
 * Detects a BCP 47 locale string from one or more signals.
 * Priority: countryCode → acceptLanguage → browserLocale → currency.
 *
 * @example
 * detectLocale({ countryCode: 'IN' })                        // → "en_IN"
 * detectLocale({ acceptLanguage: 'en-US,en;q=0.9' })        // → "en-US"
 * detectLocale({ browserLocale: 'de-DE' })                  // → "de-DE"
 * detectLocale({ currency: 'INR' })                         // → "en_IN"
 */
const detectLocale = (options: DetectLocaleOptions): Promise<string> => {
  const { countryCode, currency, acceptLanguage, browserLocale } = options;

  if (!countryCode && !currency && !acceptLanguage && !browserLocale) {
    return Promise.reject(
      new Error(
        'At least one detection signal must be provided: countryCode, currency, acceptLanguage, or browserLocale.',
      ),
    );
  }

  // Fast path: no metadata fetch needed
  if (!countryCode && !currency) {
    const locale =
      (acceptLanguage && parseAcceptLanguage(acceptLanguage)) ||
      browserLocale?.trim() ||
      null;
    return locale
      ? Promise.resolve(locale)
      : Promise.reject(
          new Error('Could not determine locale from the provided signals.'),
        );
  }

  return fetch(`${I18NIFY_DATA_SOURCE}/country/metadata/data.json`)
    .then((res) => res.json())
    .then(
      (res: {
        metadata_information: Record<CountryCodeType, CountryMetaType>;
      }) => {
        const meta = res.metadata_information;

        if (countryCode && meta[countryCode]?.default_locale) {
          return meta[countryCode].default_locale;
        }

        if (acceptLanguage) {
          const parsed = parseAcceptLanguage(acceptLanguage);
          if (parsed) return parsed;
        }

        if (browserLocale?.trim()) return browserLocale.trim();

        if (currency) {
          const cu = currency.toUpperCase();
          const entry = Object.values(meta).find(
            (info) => info.default_currency === cu,
          );
          if (entry?.default_locale) return entry.default_locale;
        }

        return Promise.reject(
          new Error('Could not determine locale from the provided signals.'),
        );
      },
    )
    .catch((err) => {
      throw new Error(
        `An error occurred while detecting locale. The error details are: ${err?.message || err}.`,
      );
    });
};

export default withErrorBoundary<typeof detectLocale>(detectLocale);
