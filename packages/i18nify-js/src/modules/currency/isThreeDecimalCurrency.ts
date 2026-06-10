import { withErrorBoundary } from '../../common/errorBoundary';
import { CurrencyCodeType } from './types';
import CURRENCY_INFO from './data/currencyConfig.json';

const isThreeDecimalCurrency = (currencyCode: CurrencyCodeType): boolean => {
  if (!(currencyCode in CURRENCY_INFO))
    throw new Error(
      `The provided currency code is invalid. The received value was: ${String(currencyCode)}. Please ensure you pass a valid currency code.`,
    );

  return CURRENCY_INFO[currencyCode].minor_unit === '3';
};

export default withErrorBoundary<typeof isThreeDecimalCurrency>(
  isThreeDecimalCurrency,
);
