import { withErrorBoundary } from '../../common/errorBoundary';
import formatDateTime from './formatDateTime';
import {
  DateInput,
  Locale,
  DateTimeFormatOptions,
  DateFormatOptions,
} from './types';

/**
 * Formats date based on the locale.
 * @param {DateInput} date - Date object or date string.
 * @param {Locale} locale - Locale string (default: 'en-IN').
 * @param {DateFormatOptions} options - Intl.DateTimeFormat options for date formatting (optional).
 * @returns {string} Formatted date string.
 */
const formatDate = (
  date: DateInput,
  locale: Locale = 'en-IN',
  options: DateFormatOptions = {},
): string => {
  const fullOptions: DateTimeFormatOptions = {
    ...options,
    timeStyle: undefined,
  };
  return formatDateTime(date, locale, fullOptions);
};

export default withErrorBoundary<typeof formatDate>(formatDate);
