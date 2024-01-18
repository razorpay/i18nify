import { withErrorBoundary } from '../../common/errorBoundary';
import state from '../.internal/state';
import { getLocale } from '../.internal/utils';

/**
 * Gets the first day of the week for a given locale.
 *
 * @param locale The locale to determine the first day of the week for.
 * @returns The first day of the week (0-6, where 0 is Sunday).
 */
const getFirstDayOfWeek = (locale: string): number => {
  /** retrieve locale from below areas in order of preference
   * 1. locale (used in case if someone wants to override locale just for a specific area and not globally)
   * 2. i18nState.locale (uses locale set globally)
   * 3. navigator (in case locale is not passed or set, use it from browser's navigator)
   * */
  if (!locale) locale = state.getState().locale || getLocale();

  let formatted;

  try {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    const sampleDate = new Date(2000, 0, 2); // A Sunday
    formatted = formatter.format(sampleDate);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error(`An unknown error occurred = ${err}`);
    }
  }

  return ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'].indexOf(
    formatted.slice(0, 2).toLowerCase(),
  );
};

export default withErrorBoundary<typeof getFirstDayOfWeek>(getFirstDayOfWeek);
