const fs = require('fs');
const currencyOriginalData = require('../../../../../../i18nify-data/currency/data.json');

// currency module json subset generation
const currencySubsetData = Object.entries(
  currencyOriginalData.currency_information,
).reduce((acc, [key, value]) => {
  acc[key] = {
    name: value.name,
    minor_unit: value.minor_unit,
    symbol: value.symbol,
  };
  return acc;
}, {});

fs.writeFileSync(
  './src/modules/.internal/jsonSubsets/currency/currencyDataSubset.json',
  JSON.stringify(currencySubsetData, null, 2),
  'utf8',
);
console.log('Currency module json data subset created successfully.');
