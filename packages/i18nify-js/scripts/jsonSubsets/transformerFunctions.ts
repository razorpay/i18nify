import {
  CurrencyInformation,
  CurrencySubsetData,
  TransformFunction,
} from './types';

export const currencyGeoDataFilePath =
  './src/modules/currency/data/currencyDataSubset.json';

// Currency-specific transformation logic
export const transformCurrencyData: TransformFunction<
  CurrencyInformation,
  CurrencySubsetData
> = (currencyOriginalData) => {
  return Object.entries(currencyOriginalData.currency_information).reduce(
    (acc, [key, value]) => {
      acc[key] = {
        name: value.name,
        minor_unit: value.minor_unit,
        symbol: value.symbol,
      };
      return acc;
    },
    {},
  );
};

// Other module-specific transformation logic here
