export interface CurrencyDetail {
  name: string;
  numeric_code: string;
  minor_unit: string;
  symbol: string;
  physical_currency_denominations: string[];
}

export interface CurrencyInformation {
  currency_information: {
    [key: string]: CurrencyDetail;
  };
}

export interface CurrencySubsetData {
  [key: string]: {
    name: string;
    minor_unit: string;
    symbol: string;
  };
}

export interface TransformFunction<TInput, TOutput> {
  (data: TInput): TOutput;
}
