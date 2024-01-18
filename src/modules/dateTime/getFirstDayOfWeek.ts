import { withErrorBoundary } from '../../common/errorBoundary';
import state from '../.internal/state';
import { getLocale } from '../.internal/utils';

/**
 * Gets the first day of the week for a given locale.
 *
 * @param locale The locale to determine the first day of the week for.
 * @param intlOptions Optional Intl.DateTimeFormatOptions for customization.
 * @returns The first day of the week (0-6, where 0 is Sunday).
 */
const getFirstDayOfWeek = (
  locale: string,
  intlOptions: Intl.DateTimeFormatOptions = {},
): string => {
  /** retrieve locale from below areas in order of preference
   * 1. locale (used in case if someone wants to override locale just for a specific area and not globally)
   * 2. i18nState.locale (uses locale set globally)
   * 3. navigator (in case locale is not passed or set, use it from browser's navigator)
   * */
  if (!locale) locale = state.getState().locale || getLocale();

  let formatted;

  if (!intlOptions.weekday) intlOptions.weekday = 'long';

  try {
    const formatter = new Intl.DateTimeFormat(locale, intlOptions);
    /**
     * This date was chosen because January 2, 2000, is a Sunday.
     * In the Gregorian calendar, Sunday is considered the start of the week in some cultures (like in the United States), while in others, it's Monday (like in much of Europe).
     * By using a date that is known to be a Sunday, the function can accurately determine what day of the week is considered the start in the specified locale.
     */
    const sundayDate = new Date(2000, 0, 2); // A known Sunday
    formatted = formatter.format(sundayDate);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error(`An unknown error occurred = ${err}`);
    }
  }

  // Generate localized weekdays array starting from Sunday
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, intlOptions).format(
      new Date(2000, 0, 2 + i),
    ),
  );

  const firstDayIndex = weekdays.indexOf(formatted);
  if (firstDayIndex === -1) {
    throw new Error('Unable to determine the first day of the week');
  }

  return weekdays[(firstDayIndex + 1) % 7]; // Adjusting since our reference date is a Sunday
};

export default withErrorBoundary<typeof getFirstDayOfWeek>(getFirstDayOfWeek);
