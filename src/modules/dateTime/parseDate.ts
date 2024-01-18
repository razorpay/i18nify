import { withErrorBoundary } from '../../common/errorBoundary';
import state from '../.internal/state';
import { getLocale } from '../.internal/utils';
import { LOCALE_DATE_FORMATS } from './data/localeDateFormats';
import parseDateWithFormat from './parseDateWithFormat';
import { Locale } from './types';

/**
 * Attempts to parse a string into a date object based on locale.
 * Uses the localeDateFormats mapping for determining the date format.
 *
 * @param dateString - The date string to parse.
 * @param locale - The locale to use for parsing.
 * @returns The parsed Date object or null if parsing fails.
 */
const parseDate = (dateString: string, locale: Locale): Date | null => {
  /** retrieve locale from below areas in order of preference
   * 1. locale (used in case if someone wants to override locale just for a specific area and not globally)
   * 2. i18nState.locale (uses locale set globally)
   * 3. navigator (in case locale is not passed or set, use it from browser's navigator)
   * */
  if (!locale) locale = state.getState().locale || getLocale();

  const format = LOCALE_DATE_FORMATS[locale];
  if (!format) {
    throw new Error(`No date format found for locale: ${locale}`);
  }
  return parseDateWithFormat(dateString, format);
};

export default withErrorBoundary<typeof parseDate>(parseDate);
