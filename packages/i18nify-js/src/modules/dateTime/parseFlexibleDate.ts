import { withErrorBoundary } from '../../common/errorBoundary';
import { DateInput } from './types';
import { convertToStandardDate } from './utils';

export interface ParsedFlexibleDate {
  date: Date;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  timestamp: number;
}

/**
 * Parses a date in any supported format and returns a structured result.
 *
 * Accepts:
 * - Date objects (returned as-is)
 * - Unix timestamps (milliseconds since epoch as a number)
 * - Date strings in multiple formats: ISO 8601, YYYY/MM/DD, DD/MM/YYYY,
 *   MM/DD/YYYY, DD-MM-YYYY, YYYY.MM.DD, and their datetime variants.
 *
 * @param {DateInput} input - A Date object, Unix timestamp (ms), or date string.
 * @returns {ParsedFlexibleDate} Structured date components plus the Date and timestamp.
 */
const parseFlexibleDate = (input: DateInput): ParsedFlexibleDate => {
  if (input === null || input === undefined || input === '') {
    throw new Error(
      `parseFlexibleDate: invalid input — received: ${String(input)}.`,
    );
  }

  const date = convertToStandardDate(input);

  if (isNaN(date.getTime())) {
    throw new Error(
      `parseFlexibleDate: could not parse "${String(input)}" as a valid date.`,
    );
  }

  return {
    date,
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
    timestamp: date.getTime(),
  };
};

export default withErrorBoundary<typeof parseFlexibleDate>(parseFlexibleDate);
