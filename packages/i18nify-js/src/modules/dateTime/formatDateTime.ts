import { DateFormatter } from '@internationalized/date';

import { withErrorBoundary } from '../../common/errorBoundary';
import { getLocale } from '../.internal/utils';
import { DateInput, DateTimeFormatOptions, Locale } from './types';
import { convertToStandardDate } from './utils';

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
    dateTimeMode?:
      | 'dateOnly'
      | 'timeOnly'
      | 'dateTime'
      | string
      | null
      | undefined;
    intlOptions?: Intl.DateTimeFormatOptions;
  } = {},
): string => {
  const extractedLocale = getLocale(options);

  const standardDate = convertToStandardDate(date);

  let finalIntlOptions: DateTimeFormatOptions = {};
  switch (options.dateTimeMode) {
    case 'dateOnly':
      finalIntlOptions = {
        year: options.intlOptions?.year || 'numeric',
        month: options.intlOptions?.month || 'numeric',
        day: options.intlOptions?.day || 'numeric',
      };
      break;
    case 'timeOnly':
      finalIntlOptions = {
        hour: options.intlOptions?.hour || 'numeric',
        minute: options.intlOptions?.minute || 'numeric',
        second: options.intlOptions?.second || 'numeric',
      };
      if (options.intlOptions?.hour12 !== undefined)
        finalIntlOptions.hour12 = options.intlOptions?.hour12;
      break;
    case 'dateTime':
      finalIntlOptions = {
        year: options.intlOptions?.year || 'numeric',
        month: options.intlOptions?.month || 'numeric',
        day: options.intlOptions?.day || 'numeric',
        hour: options.intlOptions?.hour || 'numeric',
        minute: options.intlOptions?.minute || 'numeric',
        second: options.intlOptions?.second || 'numeric',
      };
      if (options.intlOptions?.hour12 !== undefined)
        finalIntlOptions.hour12 = options.intlOptions?.hour12;
      break;
    default:
      finalIntlOptions = { ...options.intlOptions };
  }

  let formatter;

  try {
    formatter = new DateFormatter(extractedLocale, finalIntlOptions);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error(`An unknown error occurred = ${err}`);
    }
  }

  return formatter.format(new Date(standardDate));
};

export default withErrorBoundary<typeof formatDateTime>(formatDateTime);
