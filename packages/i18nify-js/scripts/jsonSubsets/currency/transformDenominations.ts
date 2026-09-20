/**
 * Creates a `code -> physical_currency_denominations` map from parent
 * i18nify-data. Kept separate from currencyConfig.json so that only
 * `getDenomination` pays for the denomination lists.
 *
 * @example
 * { "AFN": ["1", "2", "5", "10", "20", "50", "100", "500", "1000"] }
 */

export default () => {
  const DATA = require('#/i18nify-data/currency/data.json');

  const currencyInfo = DATA.currency_information;

  const denominations = Object.keys(currencyInfo).reduce(
    (acc: Record<string, string[]>, code: string) => {
      acc[code] = currencyInfo[code].physical_currency_denominations ?? [];
      return acc;
    },
    {},
  );

  return {
    data: denominations,
    subsetFilePath: './src/modules/currency/data/denominations.json',
  };
};
