import { CURRENCIES } from '../../currency/data/currencies';
import { getLocale } from './getLocale';

export const getIntlInstanceWithOptions = (
  options: {
    currency?: keyof typeof CURRENCIES;
    locale?: string;
    intlOptions?: Intl.NumberFormatOptions;
  } = {},
) => {
  let locale = options?.locale;

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

  return new Intl.NumberFormat(locale || undefined, intlOptions);
};
