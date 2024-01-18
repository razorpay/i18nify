import { withErrorBoundary } from '../../common/errorBoundary';
import add from './add';

/**
 * Subtracts a specified amount of time from a date.
 *
 * @param date The original date.
 * @param value The amount to subtract.
 * @param unit The unit of time to subtract (e.g., 'days', 'months', 'years').
 * @returns A new Date object with the time subtracted.
 */
const subtract = (
  date: Date,
  value: number,
  unit: 'days' | 'months' | 'years',
): Date => {
  return add(date, -value, unit); // Reuse the add function with negative value
};

export default withErrorBoundary<typeof subtract>(subtract);
