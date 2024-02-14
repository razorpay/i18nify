import { withErrorBoundary } from '../../common/errorBoundary';
import { getLocale } from '../.internal/utils';
import {
  DateInput,
  Locale,
  DateTimeFormatOptions,
  TimeFormatOptions,
} from './types';

/**
 * Formats time based on the locale.
 * @param {DateInput} date - Date object or date string.
 * @param options - Config object
 * @returns {string} Formatted time string.
 * 
 * Example 1: en-US locale, date: 2024-01-01T12:00:00 ---> Output: 12:00:00 PM
 * Example 2: en-IN locale, date: Wed Feb 14 2024 17:18:42 GMT+0530 (India Standard Time) ---> Output: 5:18:42 pm
 * Example 3: fr-FR locale, date: Wed Feb 14 2024 17:18:42 GMT+0530 (India Standard Time) ---> Output: 17:18:42
 */
const formatTime = (
  date: DateInput,
  options: {
    locale?: Locale,
    intlOptions?: TimeFormatOptions,
  } = {},
): string => {
  const locale = getLocale(options);

  const fullOptions: DateTimeFormatOptions = {
    hour: 'numeric', 
    minute: 'numeric', 
    second: 'numeric',
    ...options.intlOptions,
  };

  let formattedTime;

  try {
    formattedTime = new Intl.DateTimeFormat(locale, fullOptions).format(new Date(date));
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error(`An unknown error occurred = ${err}`);
    }
  }

  return formattedTime;
};

export default withErrorBoundary<typeof formatTime>(formatTime);
