import { withErrorBoundary } from '../../common/errorBoundary';
import state from '../.internal/state';
import { getLocale } from '../.internal/utils';
import formatDateTime from './formatDateTime';
import {
  DateInput,
  Locale,
  DateTimeFormatOptions,
  TimeFormatOptions,
} from './types';

/**
 * Formats time based on the locale.
 * @param {DateInput} date - Date object or date string.
 * @param options - Config object
 * @returns {string} Formatted time string.
 */
const formatTime = (
  date: DateInput,
  options: {
    locale?: Locale,
    intlOptions?: TimeFormatOptions,
  } = {},
): string => {
  /** retrieve locale from below areas in order of preference
   * 1. locale (used in case if someone wants to override locale just for a specific area and not globally)
   * 2. i18nState.locale (uses locale set globally)
   * 3. navigator (in case locale is not passed or set, use it from browser's navigator)
   * */
  if (!options.locale) options.locale = state.getState().locale || getLocale();

  const fullOptions: DateTimeFormatOptions = {
    ...options.intlOptions,
    dateStyle: undefined,
  };

  let formattedTime;

  try {
    formattedTime = formatDateTime(date, {locale: options.locale, intlOptions: fullOptions})
      .split(',')[1]
      .trim();
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error(`An unknown error occurred = ${err}`);
    }
  }

  return formattedTime;
};

export default withErrorBoundary<typeof formatTime>(formatTime);
