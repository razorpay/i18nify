export interface Currency {
  symbol: string;
  name: string;
}

export interface GetCurrencyListOutput {
  [currencyCode: string]: Currency;
}
