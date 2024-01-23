import { withErrorBoundary } from '../../common/errorBoundary';
import { DateInput } from './types';
import { stringToDate } from './utils';

/**
 * Determines the quarter of the year for a given date.
 *
 * @param date The date to determine the quarter for.
 * @returns The quarter of the year (1-4).
 */
const getQuarter = (date: DateInput): number => {
  date =
    typeof date === 'string' ? new Date(stringToDate(date)) : new Date(date);
  return Math.ceil((date.getMonth() + 1) / 3);
};

export default withErrorBoundary<typeof getQuarter>(getQuarter);
