import { withErrorBoundary } from '../../common/errorBoundary';
import state from '../.internal/state';
import { getLocale } from '../.internal/utils';
import { DateInput, Locale } from './types';
import { stringToDate } from './utils';

/**
 * Provides a relative time string (e.g., '3 hours ago', 'in 2 days').
 * This function calculates the difference between the given date and the base date,
 * then formats it in a locale-sensitive manner. It allows customization of the output
 * through Intl.RelativeTimeFormat options.
 *
 * @param date - The date to compare.
 * @param baseDate - The date to compare against (default: current date).
 * @param options - Config object.
 * @returns The relative time as a string.
 */
const getRelativeTime = (
  date: DateInput,
  baseDate: DateInput = new Date(),
  options: {
    locale?: Locale,
    intlOptions?: Intl.RelativeTimeFormatOptions,
  } = {},
): string => {
  date =
    typeof date === 'string' ? new Date(stringToDate(date)) : new Date(date);

  baseDate =
    typeof baseDate === 'string'
      ? new Date(stringToDate(baseDate))
      : new Date(baseDate);
  /** retrieve locale from below areas in order of preference
   * 1. locale (used in case if someone wants to override locale just for a specific area and not globally)
   * 2. i18nState.locale (uses locale set globally)
   * 3. navigator (in case locale is not passed or set, use it from browser's navigator)
   * */
  if (!options.locale) options.locale = state.getState().locale || getLocale();

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

  let relativeTime;

  try {
    const rtf = new Intl.RelativeTimeFormat(options.locale, options.intlOptions);
    relativeTime = rtf.format(Math.round(value), unit);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error(`An unknown error occurred = ${err}`);
    }
  }

  return relativeTime;
};

export default withErrorBoundary<typeof getRelativeTime>(getRelativeTime);
