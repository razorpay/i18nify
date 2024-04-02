const fs = require('fs');
const path = require('path');
const currencyOriginalData = require('../../../../../../i18nify-data/currency/data.json');

const currencyGeoDataFilePath =
  './src/modules/.internal/jsonSubsets/currency/currencyDataSubset.json';

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

if (fs.existsSync(currencyGeoDataFilePath)) {
  // If the file exists, delete it
  fs.unlinkSync(currencyGeoDataFilePath);
}

const dirPath = path.dirname(currencyGeoDataFilePath);
fs.mkdirSync(dirPath, { recursive: true });

fs.writeFileSync(
  currencyGeoDataFilePath,
  JSON.stringify(currencySubsetData, null, 2),
  'utf8',
);
console.log('Currency module json data subset created successfully.');
