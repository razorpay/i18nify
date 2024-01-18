import { withErrorBoundary } from '../../common/errorBoundary';
import state from '../.internal/state';
import { getLocale } from '../.internal/utils';
import { Locale } from './types';

/**
 * Returns an array of weekdays according to the specified locale.
 *
 * @param locale The locale to get weekdays for.
 * @returns An array of weekday names.
 */
const getWeekdays = (locale: Locale): string[] => {
  try {
    /** retrieve locale from below areas in order of preference
     * 1. locale (used in case if someone wants to override locale just for a specific area and not globally)
     * 2. i18nState.locale (uses locale set globally)
     * 3. navigator (in case locale is not passed or set, use it from browser's navigator)
     * */
    if (!locale) locale = state.getState().locale || getLocale();
    const formatter = new Intl.DateTimeFormat(locale, { weekday: 'long' });
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
