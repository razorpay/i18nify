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
