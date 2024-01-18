import { withErrorBoundary } from '../../common/errorBoundary';

/**
 * Provides a relative time string (e.g., '3 hours ago', 'in 2 days').
 * This function calculates the difference between the given date and the base date,
 * then formats it in a locale-sensitive manner. It allows customization of the output
 * through Intl.RelativeTimeFormat options.
 *
 * @param date - The date to compare.
 * @param baseDate - The date to compare against (default: current date).
 * @param locale - The locale to use for formatting (default: 'en-IN').
 * @param options - Options for the Intl.RelativeTimeFormat (optional).
 * @returns The relative time as a string.
 */
const getRelativeTime = (
  date: Date,
  baseDate: Date = new Date(),
  locale: string = 'en-IN',
  options?: Intl.RelativeTimeFormatOptions,
): string => {
  const diffInSeconds = (date.getTime() - baseDate.getTime()) / 1000;

  // Define time units in seconds
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;

  let value: number;
  let unit: Intl.RelativeTimeFormatUnit;

  if (Math.abs(diffInSeconds) < minute) {
    value = diffInSeconds;
    unit = 'second';
  } else if (Math.abs(diffInSeconds) < hour) {
    value = diffInSeconds / minute;
    unit = 'minute';
  } else if (Math.abs(diffInSeconds) < day) {
    value = diffInSeconds / hour;
    unit = 'hour';
  } else if (Math.abs(diffInSeconds) < week) {
    value = diffInSeconds / day;
    unit = 'day';
  } else if (Math.abs(diffInSeconds) < month) {
    value = diffInSeconds / week;
    unit = 'week';
  } else if (Math.abs(diffInSeconds) < year) {
    value = diffInSeconds / month;
    unit = 'month';
  } else {
    value = diffInSeconds / year;
    unit = 'year';
  }

  const rtf = new Intl.RelativeTimeFormat(locale, options);
  return rtf.format(Math.round(value), unit);
}

export default withErrorBoundary<typeof getRelativeTime>(getRelativeTime);
