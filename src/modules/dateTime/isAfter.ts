import { withErrorBoundary } from '../../common/errorBoundary';
import { DateInput } from './types';

/**
 * Compares two dates to determine if the first is after the second.
 * @param {DateInput} date1 - First date object or date string.
 * @param {DateInput} date2 - Second date object or date string.
 * @returns {boolean} True if date1 is after date2.
 */
const isAfter = (date1: DateInput, date2: DateInput): boolean => {
  const dateObj1: Date = date1 instanceof Date ? date1 : new Date(date1);
  const dateObj2: Date = date2 instanceof Date ? date2 : new Date(date2);
  return dateObj1 > dateObj2;
};

export default withErrorBoundary<typeof isAfter>(isAfter);
