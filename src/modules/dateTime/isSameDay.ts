import { withErrorBoundary } from '../../common/errorBoundary';
import { stringToDate } from './utils';

/**
 * Checks if two dates fall on the same day.
 *
 * @param date1 The first date.
 * @param date2 The second date.
 * @returns True if both dates are on the same day, false otherwise.
 */
const isSameDay = (date1: Date, date2: Date): boolean => {
  date1 =
    typeof date1 === 'string' ? new Date(stringToDate(date1)) : new Date(date1);
  date2 =
    typeof date2 === 'string' ? new Date(stringToDate(date2)) : new Date(date2);

  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export default withErrorBoundary<typeof isSameDay>(isSameDay);
