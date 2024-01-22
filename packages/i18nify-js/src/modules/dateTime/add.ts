import { withErrorBoundary } from '../../common/errorBoundary';
import { DateInput } from './types';
import { stringToDate } from './utils';

/**
 * Adds a specified amount of time to a date.
 *
 * @param date The original date.
 * @param value The amount to add.
 * @param unit The unit of time to add (e.g., 'days', 'months', 'years').
 * @returns A new Date object with the time added.
 */
const add = (
  date: DateInput,
  value: number,
  unit: 'days' | 'months' | 'years',
): Date => {
  date =
    typeof date === 'string' ? new Date(stringToDate(date)) : new Date(date);

  switch (unit) {
    case 'days':
      date.setDate(date.getDate() + value);
      break;
    case 'months':
      date.setMonth(date.getMonth() + value);
      break;
    case 'years':
      date.setFullYear(date.getFullYear() + value);
      break;
  }
  return date;
};

export default withErrorBoundary<typeof add>(add);
