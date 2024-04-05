import { withErrorBoundary } from '../../common/errorBoundary';
import { CurrencyCodeType } from './types';
import CURRENCY_INFO from './data/currencyDataSubset.json';

const getCurrencySymbol = (currencyCode: CurrencyCodeType): string => {
  const currencyInformation = CURRENCY_INFO;
  if (currencyCode in currencyInformation)
    return currencyInformation[currencyCode]?.symbol;
  else throw new Error(`Invalid currencyCode: ${String(currencyCode)}`);
};

export default withErrorBoundary<typeof getCurrencySymbol>(getCurrencySymbol);
