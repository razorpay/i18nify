import { CURRENCIES } from './data/currencies';
import { withErrorBoundary } from '../../common/errorBoundary';
import { CurrencyCodeType } from './types';

const getCurrencySymbol = (currencyCode: CurrencyCodeType): string => {
  if (currencyCode in CURRENCIES) return CURRENCIES[currencyCode]?.symbol;
  else throw new Error('Invalid currencyCode!');
};

export default withErrorBoundary<typeof getCurrencySymbol>(getCurrencySymbol);
