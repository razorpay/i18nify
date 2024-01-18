import { withErrorBoundary } from '../../common/errorBoundary';
import state from '../.internal/state';
import { getLocale } from '../.internal/utils';
import { DateInput, Locale } from './types';
import { stringToDate } from './utils';

/**
 * Formats date and time based on the locale.
 * @param {DateInput} date - Date object or date string.
 * @param {Locale} locale - Locale string.
 * @param {DateTimeFormatOptions} options - Intl.DateTimeFormat options (optional).
 * @returns {string} Formatted date and time string.
 */
const formatDateTime = (
  date: DateInput,
  locale: Locale,
  intlOptions: Intl.DateTimeFormatOptions = {},
): string => {
  /** retrieve locale from below areas in order of preference
   * 1. locale (used in case if someone wants to override locale just for a specific area and not globally)
   * 2. i18nState.locale (uses locale set globally)
   * 3. navigator (in case locale is not passed or set, use it from browser's navigator)
   * */
  if (!locale) locale = state.getState().locale || getLocale();

  date =
    typeof date === 'string' ? new Date(stringToDate(date)) : new Date(date);

  const dateObj: Date = date instanceof Date ? date : new Date(date);
  let formatter;

  try {
    formatter = new Intl.DateTimeFormat(locale, intlOptions);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error(`An unknown error occurred = ${err}`);
    }
  }

  return formatter.format(dateObj);
};

export default withErrorBoundary<typeof formatDateTime>(formatDateTime);
