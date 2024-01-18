import { withErrorBoundary } from '../../common/errorBoundary';

/**
 * Parses a date string based on a specific format.
 *
 * @param dateString The date string to parse.
 * @param format The format to use for parsing.
 * @returns The parsed Date object or null if parsing fails.
 */
const parseDateWithFormat = (
  dateString: string,
  format: string,
): Date | null => {
  // Determine the separator based on the format (supports '/', '.', or '-')
  const separator = format.includes('/')
    ? '/'
    : format.includes('.')
    ? `.`
    : `-`;
  const formatParts = format.split(separator);
  const dateParts = dateString.split(separator).map((num) => parseInt(num, 10));

  let year: number = 0,
    month: number = 0,
    day: number = 0;
  let yearSet: boolean = false,
    monthSet: boolean = false,
    daySet: boolean = false;

  // Check for format and date string mismatch
  if (dateParts.length !== formatParts.length) {
    return null; // Mismatch between date string and format
  }

  formatParts.forEach((part, index) => {
    // Check for non-numeric values in date string
    if (isNaN(dateParts[index])) {
      return null; // Invalid date part
    }

    // Assign year, month, and day based on the format
    switch (part) {
      case 'DD':
        day = dateParts[index];
        daySet = true;
        break;
      case 'MM':
        month = dateParts[index] - 1; // Adjust for zero-indexed months in JavaScript Date
        monthSet = true;
        break;
      case 'YYYY':
        year = dateParts[index];
        yearSet = true;
        break;
    }
  });

  // Validate and create the date only if all parts are set
  if (yearSet && monthSet && daySet) {
    const parsedDate = new Date(year, month, day);
    // Validate date to catch invalid dates like February 30th
    if (
      parsedDate.getFullYear() === year &&
      parsedDate.getMonth() === month &&
      parsedDate.getDate() === day
    ) {
      return parsedDate;
    }
  }
  return null; // Invalid date or incomplete date information
};

export default withErrorBoundary<typeof parseDateWithFormat>(
  parseDateWithFormat,
);
