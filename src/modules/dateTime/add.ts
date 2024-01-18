import { withErrorBoundary } from '../../common/errorBoundary';

/**
 * Adds a specified amount of time to a date.
 *
 * @param date The original date.
 * @param value The amount to add.
 * @param unit The unit of time to add (e.g., 'days', 'months', 'years').
 * @returns A new Date object with the time added.
 */
const add = (
  date: Date,
  value: number,
  unit: 'days' | 'months' | 'years',
): Date => {
  const result = new Date(date);
  switch (unit) {
    case 'days':
      result.setDate(result.getDate() + value);
      break;
    case 'months':
      result.setMonth(result.getMonth() + value);
      break;
    case 'years':
      result.setFullYear(result.getFullYear() + value);
      break;
  }
  return result;
};

export default withErrorBoundary<typeof add>(add);
