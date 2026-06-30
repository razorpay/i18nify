import { withErrorBoundary } from '../../common/errorBoundary';
import COUNTRY_METADATA_DATA from '#/i18nify-data/country/metadata/data.json';
import type { HonorificTitle } from './types';

type CountryMetadata = {
  default_locale?: string;
  locales?: Record<string, { honorific_titles?: HonorificTitle[] }>;
};

const countryMetadataData = COUNTRY_METADATA_DATA as {
  metadata_information: Record<string, CountryMetadata>;
};

/**
 * Returns honorific titles for the given ISO 3166-1 alpha-2 country code.
 *
 * The country code is matched case-insensitively. Titles are sourced from
 * country metadata locales.
 */
const getHonorificTitles = (countryCode: string): HonorificTitle[] => {
  const cc = countryCode?.trim().toUpperCase();
  if (!cc) {
    throw new Error('countryCode must not be empty');
  }

  const country = countryMetadataData.metadata_information[cc];
  if (!country?.locales) {
    throw new Error(`No honorific titles found for country code: "${cc}"`);
  }

  const defaultLocale = country.default_locale;
  const defaultTitles = defaultLocale
    ? country.locales[defaultLocale]?.honorific_titles
    : undefined;
  const titles =
    defaultTitles ??
    Object.keys(country.locales)
      .sort()
      .map((locale) => country.locales?.[locale]?.honorific_titles)
      .find((localeTitles) => localeTitles && localeTitles.length > 0);

  if (!titles || titles.length === 0) {
    throw new Error(`No honorific titles found for country code: "${cc}"`);
  }

  return titles.map((title) => ({ ...title }));
};

export default withErrorBoundary<typeof getHonorificTitles>(getHonorificTitles);
