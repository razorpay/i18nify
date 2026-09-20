/**
 * Creates a `code -> ISO 4217 numeric_code` map from parent i18nify-data.
 * Kept separate from currencyConfig.json so that only `getISONumericCode`
 * pays for it.
 *
 * @example
 * { "AFN": "971", "EUR": "978" }
 */

export default () => {
  const DATA = require('#/i18nify-data/currency/data.json');

  const currencyInfo = DATA.currency_information;

  const numericCodes = Object.keys(currencyInfo).reduce(
    (acc: Record<string, string>, code: string) => {
      acc[code] = currencyInfo[code].numeric_code;
      return acc;
    },
    {},
  );

  return {
    data: numericCodes,
    subsetFilePath: './src/modules/currency/data/numericCodes.json',
  };
};
