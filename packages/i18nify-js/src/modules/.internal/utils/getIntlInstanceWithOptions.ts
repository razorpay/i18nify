import { CURRENCIES } from '../../currency/data/currencies';
import type { I18nifyNumberFormatOptions } from '../../currency/types';
import state from '../state';
import { getLocale } from './getLocale';

export const getIntlInstanceWithOptions = (
  options: {
    currency?: keyof typeof CURRENCIES;
    locale?: string;
    intlOptions?: I18nifyNumberFormatOptions;
  } = {},
) => {
  /** retrieve locale from below areas in order of preference
   * 1. options.locale (used in case if someone wants to override locale just for a specific area and not globally)
   * 2. i18nState.locale (uses locale set globally)
   * 3. navigator (in case locale is not passed or set, use it from browser's navigator)
   * */
  let locale = options?.locale || state.getState().locale;

  // If a specific locale is provided, use it; otherwise, use the browser's locale
  if (!locale) {
    locale = getLocale();
  }

  const intlOptions = options?.intlOptions ? { ...options.intlOptions } : {};

  if (options?.currency || intlOptions.currency) {
    intlOptions.style = 'currency';
    intlOptions.currency = (options.currency || intlOptions.currency) as string;
  }

  if (!locale) throw new Error('Pass valid locale !');

  return new Intl.NumberFormat(
    locale || undefined,
    intlOptions as Intl.NumberFormatOptions,
  );
};
