import { withErrorBoundary } from '../../common/errorBoundary';
import { CurrencyCodeType } from './types';
import CURRENCY_INFO from './data/currencyConfig.json';

const getMinorUnitValue = (currencyCode: CurrencyCodeType): number => {
  if (!(currencyCode in CURRENCY_INFO))
    throw new Error(
      `The provided currency code is invalid. The received value was: ${String(currencyCode)}. Please ensure you pass a valid currency code. Check valid currency codes here: https://github.com/razorpay/i18nify/blob/master/i18nify-data/currency/data.json`,
    );

  return Number(CURRENCY_INFO[currencyCode].minor_unit);
};

export default withErrorBoundary<typeof getMinorUnitValue>(getMinorUnitValue);
