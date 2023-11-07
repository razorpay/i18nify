import { CURRENCIES } from './data/currencies';

const getCurrencySymbol = (currencyCode: keyof typeof CURRENCIES): string => {
  if (currencyCode in CURRENCIES) return CURRENCIES[currencyCode]?.symbol;
  else throw new Error('Invalid currencyCode!');
};

export default getCurrencySymbol;
