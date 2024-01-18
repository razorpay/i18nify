import { withErrorBoundary } from '../../common/errorBoundary';
import formatDateTime from './formatDateTime';
import {
  DateInput,
  Locale,
  DateTimeFormatOptions,
  TimeFormatOptions,
} from './types';

/**
 * Formats time based on the locale.
 * @param {DateInput} date - Date object or date string.
 * @param {Locale} locale - Locale string (default: 'en-IN').
 * @param {TimeFormatOptions} options - Intl.DateTimeFormat options for time formatting (optional).
 * @returns {string} Formatted time string.
 */
const formatTime = (
  date: DateInput,
  locale: Locale = 'en-IN',
  options: TimeFormatOptions = {},
): string => {
  const fullOptions: DateTimeFormatOptions = {
    ...options,
    dateStyle: undefined,
  };
  return formatDateTime(date, locale, fullOptions);
};

export default withErrorBoundary<typeof formatTime>(formatTime);
