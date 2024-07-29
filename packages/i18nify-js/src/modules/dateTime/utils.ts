import { SUPPORTED_DATE_FORMATS } from './data/supportedDateFormats';
import { DateInput } from './types';

/**
 * Converts a string representation of a date into a Date object.
 * The function supports various date and timestamp formats,
 * including both American and European styles, with or without time components.
 * If the provided string doesn't match any of the supported formats,
 * the function throws an error.
 *
 * @param {string} dateString - The date string to be converted to a Date object.
 * @returns {Date} A Date object representing the date and time specified in the dateString.
 * @throws {Error} If the date format is not recognized.
 */
export const stringToDate = (dateString: string): Date => {
  // Iterate through each supported date format.
  for (const format of SUPPORTED_DATE_FORMATS) {
    const match = dateString.match(format.regex);
    if (match) {
      // Extract year, month, and day from the matched groups.
      const year = match[format.yearIndex];
      const month = match[format.monthIndex];
      const day = match[format.dayIndex];

      // Extract time components if available, defaulting to '00' if not present.
      const hour = format.hourIndex ? match[format.hourIndex] : '00';
      const minute = format.minuteIndex ? match[format.minuteIndex] : '00';
      const second = format.secondIndex ? match[format.secondIndex] : '00';

      // Construct and return the Date object.
      try {
        const dateObj = new Date(
          `${year}-${month}-${day}T${hour}:${minute}:${second}`,
        );

        if (dateObj.getTime()) return dateObj;
        else
          throw new Error(
            `Invalid Date! The constructed date from the provided string "${dateString}" is invalid. Please ensure the date string is correct.`,
          );
      } catch (err) {
        if (err instanceof Error) {
          throw new Error(
            `An error occurred while constructing the date: ${err.message}. Please ensure the date string "${dateString}" is in a supported format.`,
          );
        } else {
          throw new Error(`An unknown error occurred. Error details: ${err}`);
        }
      }
    }
  }

  // If no format matches, throw an error.
  throw new Error(
    `Date format not recognized. The provided date string "${dateString}" does not match any supported formats. Please use a recognized date format.`,
  );
};

export const convertToStandardDate = (date: DateInput): Date => {
  const standardDate =
    typeof date === 'string' ? new Date(stringToDate(date)) : new Date(date);

  return standardDate;
};
