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
 * @param options - Config object.
 * @returns {ParsedDateTime} An object containing the parsed date and its components.
 */
const parseDateTime = (
  dateInput: DateInput,
  options: {
    locale?: Locale,
    intlOptions?: Intl.DateTimeFormatOptions,
  } = {},
): ParsedDateTime => {
  // Parse the input date, converting strings to Date objects if necessary
  const date =
    typeof dateInput === 'string'
      ? new Date(stringToDate(dateInput))
      : new Date(dateInput);

  // Use the provided locale or fallback to the system's default locale
  options.locale = options.locale || state.getState().locale || getLocale();

  try {
    // Create an Intl.DateTimeFormat instance for formatting
    const dateTimeFormat = new Intl.DateTimeFormat(options.locale, options.intlOptions);
    const formattedParts = dateTimeFormat.formatToParts(date);
    const formattedObj: FormattedPartsObject = {};

    // Iterate over each part of the formatted date
    formattedParts.forEach((part) => {
      // If the part is allowed, add it to the formatted object
      // @ts-expect-error only allowed keys are added to the formattedObj. For eg, key 'literal', 'unknown' is skipped
      if (ALLOWED_FORMAT_PARTS_KEYS.includes(part.type)) {
        // @ts-expect-error only allowed keys are added to the formattedObj. For eg, key 'literal', 'unknown' is skipped
        formattedObj[part.type] = (formattedObj[part.type] || '') + part.value;
      }
    });

    // Return the detailed parsed date object
    return {
      ...formattedObj,
      rawParts: formattedParts,
      formattedDate: formattedParts.map((p) => p.value).join(''),
      dateObj: date,
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
