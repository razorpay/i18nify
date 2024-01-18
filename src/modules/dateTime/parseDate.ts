import { withErrorBoundary } from '../../common/errorBoundary';
import { LOCALE_DATE_FORMATS } from './data/localeDateFormats';
import parseDateWithFormat from './parseDateWithFormat';

/**
 * Attempts to parse a string into a date object based on locale.
 * Uses the localeDateFormats mapping for determining the date format.
 *
 * @param dateString - The date string to parse.
 * @param locale - The locale to use for parsing.
 * @returns The parsed Date object or null if parsing fails.
 */
const parseDate = (dateString: string, locale: string): Date | null => {
  const format = LOCALE_DATE_FORMATS[locale];
  if (!format) {
    console.warn(`No date format found for locale: ${locale}`);
    return null;
  }
  return parseDateWithFormat(dateString, format);
};

export default withErrorBoundary<typeof parseDate>(parseDate);
