import { withErrorBoundary } from '../../common/errorBoundary';
import { getLocale } from '../.internal/utils';
import { DateInput, Locale } from './types';
import { stringToDate } from './utils';

/**
 * Formats date and time based on the locale.
 * @param {DateInput} date - Date object or date string.
 * @param options - Config object.
 * @returns {string} Formatted date and time string.
 */
const formatDateTime = (
  date: DateInput,
  options: {
    locale?: Locale;
    intlOptions?: Intl.DateTimeFormatOptions;
  } = {},
): string => {
  const locale = getLocale(options);

  date =
    typeof date === 'string' ? new Date(stringToDate(date)) : new Date(date);

  // Ensure default options include date and time components
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    ...options.intlOptions,
  };

  let formatter;

  try {
    formatter = new Intl.DateTimeFormat(locale, defaultOptions);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error(`An unknown error occurred = ${err}`);
    }
  }

  return formatter.format(date);
};

export default withErrorBoundary<typeof formatDateTime>(formatDateTime);
