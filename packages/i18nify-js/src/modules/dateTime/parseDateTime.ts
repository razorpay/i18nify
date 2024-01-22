import { withErrorBoundary } from '../../common/errorBoundary';
import state from '../.internal/state';
import { getLocale } from '../.internal/utils';
import {
  DateInput,
  FormattedPartsObject,
  Locale,
  ParsedDateTime,
} from './types';
import { ALLOWED_FORMAT_PARTS_KEYS } from './constants';
import { stringToDate } from './utils';

/**
 * Parses a date input and returns a detailed object containing various date components
 * and their formatted representations.
 *
 * @param {DateInput} dateInput - The date input, can be a string or a Date object.
 * @param {Intl.DateTimeFormatOptions} [intlOptions={}] - Internationalization options for date formatting.
 * @param {Locale} [locale] - The locale to use for formatting. Defaults to system locale if not provided.
 * @returns {ParsedDateTime} An object containing the parsed date and its components.
 */
const parseDateTime = (
  dateInput: DateInput,
  intlOptions: Intl.DateTimeFormatOptions = {},
  locale?: Locale,
): ParsedDateTime => {
  // Parse the input date, converting strings to Date objects if necessary
  const date =
    typeof dateInput === 'string'
      ? new Date(stringToDate(dateInput))
      : new Date(dateInput);

  // Use the provided locale or fallback to the system's default locale
  locale = locale || state.getState().locale || getLocale();

  try {
    // Create an Intl.DateTimeFormat instance for formatting
    const dateTimeFormat = new Intl.DateTimeFormat(locale, intlOptions);
    const formattedParts = dateTimeFormat.formatToParts(date);
    const formattedObj: FormattedPartsObject = {};

    // Initialize date components with default or zero values
    let year = 0,
      month = 1, // Default to January
      day = 1, // Default to the 1st day of the month
      hours = 0,
      minutes = 0,
      seconds = 0;

    // Iterate over each part of the formatted date
    formattedParts.forEach((part) => {
      // If the part is allowed, add it to the formatted object
      // @ts-expect-error only allowed keys are added to the formattedObj. For eg, key 'literal', 'unknown' is skipped
      if (ALLOWED_FORMAT_PARTS_KEYS.includes(part.type)) {
        // @ts-expect-error only allowed keys are added to the formattedObj. For eg, key 'literal', 'unknown' is skipped
        formattedObj[part.type] = (formattedObj[part.type] || '') + part.value;
      }

      // For other components, parse and assign them to the respective variables
      const value = parseInt(part.value, 10);
      switch (part.type) {
        case 'year':
          year = value;
          break;
        case 'month':
          month = value; // Keep month 1-indexed (January = 1)
          break;
        case 'day':
          day = value;
          break;
        case 'hour':
          hours = value;
          break;
        case 'minute':
          minutes = value;
          break;
        case 'second':
          seconds = value;
          break;
        default:
          // Ignore other parts
          break;
      }
    });

    // Construct the parsed date
    const parsedDate = new Date(year, month - 1, day, hours, minutes, seconds);

    // If the constructed date is invalid, throw an error
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date');
    }

    // Return the detailed parsed date object
    return {
      ...formattedObj,
      rawParts: formattedParts,
      formattedDate: formattedParts.map((p) => p.value).join(''),
      dateObj: parsedDate,
    };
  } catch (err) {
    // Handle any errors that occur during parsing
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error(`An unknown error occurred: ${err}`);
    }
  }
};

export default withErrorBoundary<typeof parseDateTime>(parseDateTime);
