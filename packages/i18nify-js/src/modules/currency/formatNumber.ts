import { withErrorBoundary } from '../../common/errorBoundary';
import { getIntlInstanceWithOptions } from '../.internal/utils';
import { CurrencyCodeType, I18nifyNumberFormatOptions } from './types';
import { INTL_MAPPING } from './constants';

// this function formats number based on different arguments passed
const formatNumber = (
  amount: string | number,
  options: {
    currency?: CurrencyCodeType;
    locale?: string;
    intlOptions?: I18nifyNumberFormatOptions;
  } = {},
): string => {
  if (!Number(amount) && Number(amount) !== 0)
    throw new Error(
      `Parameter 'amount' is not a number. typeof amount: ${typeof amount}`,
    );

  try {
    const formattedAmount = getIntlInstanceWithOptions(options).formatToParts(
      Number(amount),
    );

    const parts: Array<{ type: string; value: unknown }> = formattedAmount;
    const intlOptions = options?.intlOptions ? { ...options.intlOptions } : {};
    const currencyCode = options?.currency || intlOptions.currency;

    parts.forEach((p: { type: string; value: any }) => {
      if (p.type === 'currency' && currencyCode in INTL_MAPPING) {
        const mapping = INTL_MAPPING[currencyCode as keyof typeof INTL_MAPPING];
        if (p.value in mapping) {
          p.value = mapping[p.value as keyof typeof mapping];
        }
      }
    });

    return parts.map((p) => p.value).join('');
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error(`An unknown error occurred = ${err}`);
    }
  }
};

export default withErrorBoundary<typeof formatNumber>(formatNumber);
