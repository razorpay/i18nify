import { withErrorBoundary } from '../../common/errorBoundary';
import { getLocale } from '../.internal/utils';
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
 * @param options - config object.
 * @returns {string} Formatted date string.
 */
const formatDate = (
  date: DateInput,
  options: {
    locale?: Locale,
    intlOptions?: DateFormatOptions,
  } = {},
): string => {
  const locale = getLocale(options);

  const fullOptions: DateTimeFormatOptions = {
    ...options.intlOptions,
    timeStyle: undefined,
  };

  let formattedDate;

  try {
    formattedDate = formatDateTime(date, {locale, intlOptions: fullOptions}).split(',')[0];
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error(`An unknown error occurred = ${err}`);
    }
  }

  return formattedDate;
};

export default withErrorBoundary<typeof formatDate>(formatDate);
