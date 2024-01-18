import { withErrorBoundary } from '../../common/errorBoundary';
import { DateInput, Locale, DateTimeFormatOptions } from './types';

/**
 * Formats date and time based on the locale.
 * @param {DateInput} date - Date object or date string.
 * @param {Locale} locale - Locale string (default: 'en-IN').
 * @param {DateTimeFormatOptions} options - Intl.DateTimeFormat options (optional).
 * @returns {string} Formatted date and time string.
 */
const formatDateTime = (
  date: DateInput,
  locale: Locale = 'en-IN',
  options: DateTimeFormatOptions = {},
): string => {
  const dateObj: Date = date instanceof Date ? date : new Date(date);
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(dateObj);
}

export default withErrorBoundary<typeof formatDateTime>(formatDateTime);
