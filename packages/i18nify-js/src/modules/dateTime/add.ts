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
  if ((value !== 0 && !Number(value)) || value === Infinity)
    throw new Error('Invalid value passed!');

  date =
    typeof date === 'string' ? new Date(stringToDate(date)) : new Date(date);

  let initialDay;

  switch (unit) {
    case 'days':
      date.setDate(date.getDate() + value);
      break;
    case 'months':
      initialDay = date.getDate();
      date.setMonth(date.getMonth() + value);
      // Adjust for month-end dates
      if (date.getDate() !== initialDay) {
        date.setDate(0); // Set to the last day of the previous month
      }
      break;
    case 'years':
      // Special handling for leap years
      if (date.getMonth() === 1 && date.getDate() === 29) {
        // February 29
        const year = date.getFullYear() + value;
        if (new Date(year, 1, 29).getMonth() === 1) {
          // If the new year is a leap year, set to February 29
          date.setFullYear(year);
        } else {
          // If the new year is not a leap year, set to February 28
          date.setFullYear(year, 1, 28);
        }
      } else {
        date.setFullYear(date.getFullYear() + value);
      }
      break;
  }
  return date;
};

export default withErrorBoundary<typeof add>(add);
