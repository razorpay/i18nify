import { withErrorBoundary } from '../../common/errorBoundary';
import { getNamesData } from './data';
import type { HonorificTitle } from './types';

/**
 * Returns honorific titles for the given ISO 3166-1 alpha-2 country code.
 *
 * The country code is matched case-insensitively. The function resolves the
 * country's primary language via names data and returns that language's titles.
 */
const getHonorificTitles = (countryCode: string): HonorificTitle[] => {
  const cc = countryCode?.trim().toUpperCase();
  if (!cc) {
    throw new Error('countryCode must not be empty');
  }

  const data = getNamesData().names_information;
  const languages = data.country_to_languages[cc];
  if (!languages || languages.length === 0) {
    throw new Error(`No honorific titles found for country code: "${cc}"`);
  }

  const titles = data.honorific_titles[languages[0]];
  if (!titles) {
    throw new Error(`No honorific titles found for country code: "${cc}"`);
  }

  return titles.map((title) => ({ ...title }));
};

export default withErrorBoundary<typeof getHonorificTitles>(
  getHonorificTitles,
);
