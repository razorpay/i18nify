import { withErrorBoundary } from '../../common/errorBoundary';
import { getLocale } from '../.internal/utils';
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
    locale?: Locale;
    intlOptions?: DateFormatOptions;
  } = {},
): string => {
  const locale = getLocale(options);

  const fullOptions: DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    ...options.intlOptions,
  };

  let formattedDate;

  try {
    formattedDate = new Intl.DateTimeFormat(locale, fullOptions).format(
      new Date(date),
    );
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
