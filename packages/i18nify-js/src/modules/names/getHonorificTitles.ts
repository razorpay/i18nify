import { withErrorBoundary } from '../../common/errorBoundary';
import { HonorificTitle } from './types';
import { getNamesData } from './data';

/** Maps a BCP 47 base language subtag to the full English name used as the JSON key. */
const LANG_CODE_TO_NAME: Record<string, string> = {
  en: 'english',
  hi: 'hindi',
  fr: 'french',
  de: 'german',
  es: 'spanish',
  ar: 'arabic',
  ja: 'japanese',
  zh: 'chinese',
  pt: 'portuguese',
  ru: 'russian',
};

/**
 * Returns the list of honorific titles for the given BCP 47 base language tag.
 *
 * The locale is matched case-insensitively. If a full BCP 47 tag is supplied
 * (e.g., "en-US"), only the base language subtag ("en") is used for lookup.
 *
 * @param {string} locale - BCP 47 base language tag (e.g., "en", "hi", "fr")
 * @returns {Promise<HonorificTitle[]>} Array of honorific titles for the locale
 *
 * @throws {Error} When locale is empty or unsupported
 *
 * @example
 * const titles = await getHonorificTitles('en');
 * // [{ code: 'MR', title: 'Mr.', gender: 'male', description: '...' }, ...]
 */
const getHonorificTitles = async (
  locale: string,
): Promise<HonorificTitle[]> => {
  const trimmed = (locale ?? '').trim();
  if (!trimmed) {
    throw new Error('locale must not be empty');
  }

  // Normalise: lowercase and extract base language subtag only.
  const base = trimmed.toLowerCase().split('-')[0];

  // Resolve BCP 47 code to the full language name used as the JSON key.
  const langName = LANG_CODE_TO_NAME[base];
  if (!langName) {
    throw new Error(`No honorific titles found for locale: "${trimmed}"`);
  }

  const data = await getNamesData().catch((err) => {
    throw new Error(
      `An error occurred while fetching names data. The error details are: ${err.message}.`,
    );
  });

  const titles = data.names_information.honorific_titles[langName];
  if (!titles) {
    throw new Error(`No honorific titles found for locale: "${trimmed}"`);
  }
  return titles;
};

export default withErrorBoundary<typeof getHonorificTitles>(getHonorificTitles);
