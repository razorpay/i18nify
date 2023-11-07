import { CURRENCIES } from './data/currencies';

export interface Currency {
  symbol: string;
  name: string;
}

export type GetCurrencyListOutput = {
  [currencyCode in keyof typeof CURRENCIES]: Currency;
};

export interface ByParts {
  currencySymbol: string;
  integerValue: string;
  decimalValue: string;
  separator: string;
  symbolAtFirst: boolean;
}
