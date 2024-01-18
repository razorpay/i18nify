import { withErrorBoundary } from '../../common/errorBoundary';

/**
 * Determines the quarter of the year for a given date.
 *
 * @param date The date to determine the quarter for.
 * @returns The quarter of the year (1-4).
 */
const getQuarter = (date: Date): number => {
  return Math.ceil((date.getMonth() + 1) / 3);
};

export default withErrorBoundary<typeof getQuarter>(getQuarter);
