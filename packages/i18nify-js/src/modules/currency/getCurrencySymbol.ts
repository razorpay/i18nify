import { withErrorBoundary } from '../../common/errorBoundary';
import { CurrencyCodeType } from './types';
import CURRENCY_INFO from './data/currencyConfig.json';

const getCurrencySymbol = (currencyCode: CurrencyCodeType): string => {
  const currencyInformation = CURRENCY_INFO;
  if (currencyCode in currencyInformation)
    return currencyInformation[currencyCode]?.symbol;
  else
    throw new Error(
      `The provided currency code is invalid. The received value was: ${String(currencyCode)}. Please ensure you pass a valid currency code. Check valid currency codes here: https://github.com/razorpay/i18nify/blob/master/i18nify-data/currency/data.json`,
    );
};

export default withErrorBoundary<typeof getCurrencySymbol>(getCurrencySymbol);
