import { withErrorBoundary } from '../../common/errorBoundary';
import { stringToDate } from './utils';

/**
 * Checks if a given object is a valid Date object.
 *
 * @param date The object to check.
 * @returns True if the object is a valid Date, false otherwise.
 */
const isValidDate = (date: any): boolean => {
  try {
    date =
      typeof date === 'string' ? new Date(stringToDate(date)) : new Date(date);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error(`An unknown error occurred = ${err}`);
    }
  }

  return date instanceof Date && !isNaN(date.getTime());
};

export default withErrorBoundary<typeof isValidDate>(isValidDate);
