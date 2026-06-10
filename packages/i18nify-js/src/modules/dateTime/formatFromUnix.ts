import { DateFormatter } from '@internationalized/date';

import { withErrorBoundary } from '../../common/errorBoundary';
import { getLocale } from '../.internal/utils';
import { DateTimeFormatOptions, Locale } from './types';

const DEFAULT_FORMAT_OPTIONS: DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

/**
 * Converts a Unix timestamp (seconds since epoch) to a timezone-aware
 * formatted datetime string using the provided locale and Intl options.
 *
 * @param {number} unixTimestamp - Seconds since the Unix epoch (integer or float).
 * @param options - Config object.
 * @param {string}  [options.timezone]    - IANA timezone name (e.g. "America/New_York").
 *                                          When omitted, the runtime's local timezone is used.
 * @param {string}  [options.locale]      - BCP 47 locale tag. Falls back to state/env locale.
 * @param {Intl.DateTimeFormatOptions} [options.intlOptions] - Overrides for individual format fields.
 * @returns {string} Formatted datetime string.
 */
const formatFromUnix = (
  unixTimestamp: number,
  options: {
    timezone?: string;
    locale?: Locale;
    intlOptions?: Intl.DateTimeFormatOptions;
  } = {},
): string => {
  if (!Number.isFinite(unixTimestamp)) {
    throw new Error(
      `Invalid Unix timestamp: received ${String(unixTimestamp)}. Expected a finite number representing seconds since the Unix epoch.`,
    );
  }

  const { timezone, intlOptions } = options;
  const resolvedLocale = getLocale(options);

  const date = new Date(unixTimestamp * 1000);

  const formatOptions: DateTimeFormatOptions = {
    ...(intlOptions ?? DEFAULT_FORMAT_OPTIONS),
    ...(timezone ? { timeZone: timezone } : {}),
  };

  const formatter = new DateFormatter(resolvedLocale, formatOptions);
  return formatter.format(date);
};

export default withErrorBoundary<typeof formatFromUnix>(formatFromUnix);
