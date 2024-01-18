import { withErrorBoundary } from '../../common/errorBoundary';

/**
 * Checks if a given object is a valid Date object.
 *
 * @param date The object to check.
 * @returns True if the object is a valid Date, false otherwise.
 */
const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
}

export default withErrorBoundary<typeof isValidDate>(isValidDate);
