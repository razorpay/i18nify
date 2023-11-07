import { CURRENCIES } from './data/currencies';

export interface Currency {
  symbol: string;
  name: string;
}

export interface GetCurrencyListOutput {
  [currencyCode: keyof typeof CURRENCIES]: Currency;
}

export interface ByParts {
  currencySymbol: string;
  integerValue: string;
  decimalValue: string;
  separator: string;
  symbolAtFirst: boolean;
}
