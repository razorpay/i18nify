import { DateFormatter } from '@internationalized/date';

import { withErrorBoundary } from '../../common/errorBoundary';
import { getLocale } from '../.internal/utils';
import { Locale } from './types';

/**
 * Returns an array of weekdays according to the specified locale.
 *
 * @param options Config object
 * @returns An array of weekday names.
 */
const getWeekdays = (options: {
  locale?: Locale;
  weekday?: 'long' | 'short' | 'narrow' | undefined;
}): string[] => {
  try {
    const locale = getLocale(options);

    const formatter = new DateFormatter(locale, {
      weekday: options.weekday || 'long',
    });

    /** The date January 1, 1970, is a well-known reference point in computing known as the Unix epoch.
     * It's the date at which time is measured for Unix systems, making it a consistent and reliable choice for date calculations.
     * The choice of the date January 4, 1970, as the starting point is significant.
     * January 4, 1970, was a Sunday.
     * Since weeks typically start on Sunday or Monday in most locales, starting from a known Sunday allows the function to cycle through a complete week, capturing all weekdays in the order they appear for the given locale.
     * */
    return Array.from({ length: 7 }, (_, i) =>
      formatter.format(new Date(1970, 0, 4 + i)),
    );
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(
        `An error occurred while creating the DateFormatter instance or formatting the weekdays: ${err.message}. Please ensure the provided options are valid and try again.`,
      );
    } else {
      throw new Error(`An unknown error occurred. Error details: ${err}`);
    }
  }
};

export default withErrorBoundary<typeof getWeekdays>(getWeekdays);
