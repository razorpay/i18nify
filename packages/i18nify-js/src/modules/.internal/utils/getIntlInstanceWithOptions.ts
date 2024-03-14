import type {
  CurrencyCodeType,
  I18nifyNumberFormatOptions,
} from '../../currency/types';
import { getLocale } from './getLocale';

export const getIntlInstanceWithOptions = (
  options: {
    currency?: CurrencyCodeType;
    locale?: string;
    intlOptions?: I18nifyNumberFormatOptions;
  } = {},
) => {
  const locale = getLocale(options);

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
