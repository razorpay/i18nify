import { withErrorBoundary } from '../../common/errorBoundary';
import { CurrencyCodeType } from './types';
import CURRENCY_INFO from './data/currencyConfig.json';

type ExtendedCurrencyEntry =
  (typeof CURRENCY_INFO)[keyof typeof CURRENCY_INFO] & {
    physical_currency_denominations?: string[];
  };

const getDenomination = (currencyCode: CurrencyCodeType): string[] => {
  if (!(currencyCode in CURRENCY_INFO))
    throw new Error(
      `The provided currency code is invalid. The received value was: ${String(currencyCode)}. Please ensure you pass a valid currency code. Check valid currency codes here: https://github.com/razorpay/i18nify/blob/master/i18nify-data/currency/data.json`,
    );

  const entry = CURRENCY_INFO[currencyCode] as ExtendedCurrencyEntry;
  return entry.physical_currency_denominations ?? [];
};

export default withErrorBoundary<typeof getDenomination>(getDenomination);
