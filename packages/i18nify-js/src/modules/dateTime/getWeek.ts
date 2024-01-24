import { withErrorBoundary } from '../../common/errorBoundary';
import { DateInput } from './types';
import { stringToDate } from './utils';

/**
 * Calculates the week number of the year for a given date.
 *
 * @param date The date to calculate the week number for.
 * @returns The week number of the year.
 */
// [TODO:] Recheck the logic here for Last day of a non-leap year (2023-12-31)
const getWeek = (date: DateInput): number => {
  date =
    typeof date === 'string' ? new Date(stringToDate(date)) : new Date(date);
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000; //  86400000 represents the number of milliseconds in a day
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export default withErrorBoundary<typeof getWeek>(getWeek);
