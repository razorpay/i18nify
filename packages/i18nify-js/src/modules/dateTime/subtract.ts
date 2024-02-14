import { withErrorBoundary } from '../../common/errorBoundary';
import add from './add';
import { DateInput } from './types';
import { stringToDate } from './utils';

/**
 * Subtracts a specified amount of time from a date.
 *
 * @param date The original date.
 * @param options config object.
 * @returns A new Date object with the time subtracted.
 */
const subtract = (
  date: DateInput,
  options:{
    value: number,
    unit: 'days' | 'months' | 'years',
  }
): Date => {
  const {value, unit} = options;
  date =
    typeof date === 'string' ? new Date(stringToDate(date)) : new Date(date);

  return add(date, {value: -value, unit: unit}); // Reuse the add function with negative value
};

export default withErrorBoundary<typeof subtract>(subtract);
