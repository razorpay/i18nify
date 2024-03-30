import { withErrorBoundary } from '../../common/errorBoundary';
import { CurrencyCodeType } from './types';
import CURRENCY_INFO from '../../../../../i18nify-data/currency/data.json';

const getCurrencySymbol = (currencyCode: CurrencyCodeType): string => {
  const currencyInformation = CURRENCY_INFO.currency_information;
  if (currencyCode in currencyInformation)
    return currencyInformation[currencyCode]?.symbol;
  else throw new Error('Invalid currencyCode!');
};

export default withErrorBoundary<typeof getCurrencySymbol>(getCurrencySymbol);
