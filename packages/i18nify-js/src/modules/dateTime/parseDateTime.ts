import { DateFormatter } from '@internationalized/date';

import { withErrorBoundary } from '../../common/errorBoundary';
import { getLocale } from '../.internal/utils';
import {
  DateInput,
  FormattedPartsObject,
  Locale,
  ParsedDateTime,
} from './types';
import { ALLOWED_FORMAT_PARTS_KEYS } from './constants';
import { convertToStandardDate } from './utils';

/**
 * Parses a date input and returns a detailed object containing various date components
 * and their formatted representations.
 *
 * @param {DateInput} date - The date input, can be a string or a Date object.
 * @param options - Config object.
 * @returns {ParsedDateTime} An object containing the parsed date and its components.
 */
const parseDateTime = (
  date: DateInput,
  options: {
    locale?: Locale;
    intlOptions?: Intl.DateTimeFormatOptions;
  } = {},
): ParsedDateTime => {
  // Parse the input date, converting strings to Date objects if necessary
  const standardDate = convertToStandardDate(date);

  const locale = getLocale(options);

  try {
    // Create an DateFormatter instance for formatting
    const dateTimeFormat = new DateFormatter(locale, options.intlOptions);
    const formattedParts = dateTimeFormat.formatToParts(standardDate);
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
      date: standardDate,
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
