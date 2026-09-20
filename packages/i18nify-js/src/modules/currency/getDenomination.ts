import { withErrorBoundary } from '../../common/errorBoundary';
import { CurrencyCodeType } from './types';
import DENOMINATIONS from './data/denominations.json';

const getDenomination = (currencyCode: CurrencyCodeType): string[] => {
  if (!(currencyCode in DENOMINATIONS))
    throw new Error(
      `The provided currency code is invalid. The received value was: ${String(currencyCode)}. Please ensure you pass a valid currency code. Check valid currency codes here: https://github.com/razorpay/i18nify/blob/master/i18nify-data/currency/data.json`,
    );

  return [...DENOMINATIONS[currencyCode as keyof typeof DENOMINATIONS]];
};

export default /*#__PURE__*/ withErrorBoundary<typeof getDenomination>(
  getDenomination,
);
