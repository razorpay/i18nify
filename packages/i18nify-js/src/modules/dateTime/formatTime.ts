import { withErrorBoundary } from '../../common/errorBoundary';
import { getLocale } from '../.internal/utils';
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
 * @param options - Config object
 * @returns {string} Formatted time string.
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
    ...options.intlOptions,
    dateStyle: undefined,
  };

  let formattedTime;

  try {
    formattedTime = formatDateTime(date, {locale, intlOptions: fullOptions})
      .split(',')[1]
      .trim();
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
