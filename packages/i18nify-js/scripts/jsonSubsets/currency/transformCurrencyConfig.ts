/**
 * Creates a smaller json currency configuration from parent i18nify-data. 
 * 
 * @example
 * {"AFN": {
      "name": "Afghani",
      "numeric_code": "971",
      "minor_unit": "2",
      "symbol": "؋",
      "physical_currency_denominations": [
        "1",
        "2",
        "5",
        "10",
        "20",
        "50",
        "100",
        "500",
        "1000"
      ]
    }
    transforms to 
    {"AFN": {
      "name": "Afghani",
      "minor_unit": "2",
      "symbol": "؋"
      }
    }
    
 * 
 */

export default () => {
  const DATA = require('#/i18nify-data/currency/data.json');

  const currencyInfo = DATA.currency_information;

  const currencyConfigSubset = Object.keys(currencyInfo).reduce(
    (acc: any, curr: any) => {
      acc[curr] = {
        name: currencyInfo[curr].name,
        minor_unit: currencyInfo[curr].minor_unit,
        symbol: currencyInfo[curr].symbol,
      };
      return acc;
    },
    {},
  );

  return {
    data: currencyConfigSubset,
    subsetFilePath: './src/modules/currency/data/currencyConfig.json',
  };
};
