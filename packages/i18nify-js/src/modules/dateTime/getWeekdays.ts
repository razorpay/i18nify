import { withErrorBoundary } from '../../common/errorBoundary';
import state from '../.internal/state';
import { getLocale } from '../.internal/utils';
import { Locale } from './types';

/**
 * Returns an array of weekdays according to the specified locale.
 *
 * @param locale The locale to get weekdays for.
 * @param intlOptions Optional Intl.DateTimeFormatOptions for customization.
 * @returns An array of weekday names.
 */
const getWeekdays = (
  locale?: Locale,
  intlOptions: Intl.DateTimeFormatOptions = {},
): string[] => {
  try {
    /** retrieve locale from below areas in order of preference
     * 1. locale (used in case if someone wants to override locale just for a specific area and not globally)
     * 2. i18nState.locale (uses locale set globally)
     * 3. navigator (in case locale is not passed or set, use it from browser's navigator)
     * */
    if (!locale) locale = state.getState().locale || getLocale();
    if (!intlOptions.weekday) intlOptions.weekday = 'long';

    const formatter = new Intl.DateTimeFormat(locale, intlOptions);

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
      throw new Error(err.message);
    } else {
      throw new Error(`An unknown error occurred = ${err}`);
    }
  }
};

export default withErrorBoundary<typeof getWeekdays>(getWeekdays);
