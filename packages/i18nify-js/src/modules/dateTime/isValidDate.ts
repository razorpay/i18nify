import { withErrorBoundary } from '../../common/errorBoundary';
import state from '../.internal/state';
import { getLocale } from '../.internal/utils';
import { LOCALE_DATE_FORMATS } from './data/localeDateFormats';
import { Locale } from './types';

/**
 * Checks if a given string is a valid date according to a specific locale's date format.
 *
 * @param dateString The date string to validate.
 * @param options Config object
 * @returns True if the dateString is a valid date according to the locale's format, false otherwise.
 */
const isValidDate = (dateString: string, options: {locale?: Locale}): boolean => {
  // Use the provided locale or fallback to the system's default locale
  options.locale = options.locale || state.getState().locale || getLocale();

  // Type guard to ensure dateString is a string
  if (typeof dateString !== 'string') {
    return false;
  }

  // Determine the date format based on the given locale
  const dateFormat = LOCALE_DATE_FORMATS[options.locale];
  const delimiter = /[-/.]/;
  const [part1, part2, part3] = dateString.split(delimiter);

  let year: string, month: string, day: string;
  switch (dateFormat) {
    case 'DD/MM/YYYY':
    case 'DD.MM.YYYY':
    case 'DD-MM-YYYY':
      // Extract day, month, and year for formats where the day comes first
      [day, month, year] = [part1, part2, part3];
      break;
    case 'YYYY/MM/DD':
    case 'YYYY-MM-DD':
    case 'YYYY.MM.DD':
      // Extract year, month, and day for formats where the year comes first
      [year, month, day] = [part1, part2, part3];
      break;
    case 'MM-DD-YYYY':
      // Extract month, day and year for formats where the year comes first
      [month, day, year] = [part1, part2, part3];
      break;
    default:
      // Return false for unrecognized formats
      return false;
  }

  try {
    // Parsing and validating the date components
    const parsedDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
    );
    return (
      parsedDate.getFullYear() === parseInt(year) &&
      parsedDate.getMonth() === parseInt(month) - 1 &&
      parsedDate.getDate() === parseInt(day)
    );
  } catch (e) {
    // Return false in case of any parsing errors
    return false;
  }
};

export default withErrorBoundary<typeof isValidDate>(isValidDate);
