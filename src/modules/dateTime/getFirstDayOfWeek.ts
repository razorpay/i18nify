import { withErrorBoundary } from '../../common/errorBoundary';

/**
 * Gets the first day of the week for a given locale.
 *
 * @param locale The locale to determine the first day of the week for.
 * @returns The first day of the week (0-6, where 0 is Sunday).
 */
function getFirstDayOfWeek(locale: string): number {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const sampleDate = new Date(2000, 0, 2); // A Sunday
  const formatted = formatter.format(sampleDate);
  return ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'].indexOf(
    formatted.slice(0, 2).toLowerCase(),
  );
}

export default withErrorBoundary<typeof getFirstDayOfWeek>(getFirstDayOfWeek);
