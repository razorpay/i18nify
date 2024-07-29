import { withErrorBoundary } from '../../common/errorBoundary';
import { getLocale } from '../.internal/utils';
import { DateInput, Locale } from './types';
import { convertToStandardDate } from './utils';

/**
 * Provides a relative time string (e.g., '3 hours ago', 'in 2 days').
 * This function calculates the difference between the given date and the base date,
 * then formats it in a locale-sensitive manner. It allows customization of the output
 * through Intl.RelativeTimeFormat options.
 *
 * @param date - The date to compare.
 * @param options - Config object.
 * @returns The relative time as a string.
 */
const getRelativeTime = (
  date: DateInput,
  options: {
    locale?: Locale;
    baseDate?: DateInput;
    intlOptions?: Intl.RelativeTimeFormatOptions;
  } = {},
): string => {
  const standardDate = convertToStandardDate(date);
  const standardBaseDate = convertToStandardDate(
    options.baseDate || new Date(),
  );

  const locale = getLocale(options);

  const diffInSeconds =
    (standardDate.getTime() - standardBaseDate.getTime()) / 1000;

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
    const rtf = new Intl.RelativeTimeFormat(locale, options.intlOptions);
    relativeTime = rtf.format(Math.round(value), unit);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(
        `An error occurred while creating the RelativeTimeFormat instance: ${err.message}. Please ensure the provided options are valid and try again.`,
      );
    } else {
      throw new Error(`An unknown error occurred. Error details: ${err}`);
    }
  }

  return relativeTime;
};

export default withErrorBoundary<typeof getRelativeTime>(getRelativeTime);
