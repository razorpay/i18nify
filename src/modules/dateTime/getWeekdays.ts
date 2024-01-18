import { withErrorBoundary } from '../../common/errorBoundary';
import { Locale } from './types';

/**
 * Returns an array of weekdays according to the specified locale.
 *
 * @param locale The locale to get weekdays for.
 * @returns An array of weekday names.
 */
const getWeekdays = (locale: Locale): string[] => {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'long' });
  return Array.from({ length: 7 }, (_, i) =>
    formatter.format(new Date(1970, 0, 4 + i)),
  );
};

export default withErrorBoundary<typeof getWeekdays>(getWeekdays);
