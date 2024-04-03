import * as fs from 'fs';
import * as path from 'path';
import currencyOriginalData from '#/i18nify-data/currency/data.json';

const currencyGeoDataFilePath =
  './src/modules/.internal/jsonSubsets/currency/currencyDataSubset.json';

interface CurrencyDetail {
  name: string;
  numeric_code: string;
  minor_unit: string;
  symbol: string;
  physical_currency_denominations: string[];
}

interface CurrencyInformation {
  [key: string]: CurrencyDetail;
}

interface CurrencySubsetData {
  [key: string]: {
    name: string;
    minor_unit: string;
    symbol: string;
  };
}

const currencySubsetData: CurrencySubsetData = Object.entries(
  (currencyOriginalData as CurrencyInformation).currency_information,
).reduce((acc: CurrencySubsetData, [key, value]: [string, CurrencyDetail]) => {
  acc[key] = {
    name: value.name,
    minor_unit: value.minor_unit,
    symbol: value.symbol,
  };
  return acc;
}, {});

// Check if the file exists before trying to delete it, then use async functions to handle file operations
const createCurrencyGeoDataFile = async () => {
  if (fs.existsSync(currencyGeoDataFilePath)) {
    // If the file exists, delete it
    fs.unlinkSync(currencyGeoDataFilePath);
  }

  const dirPath = path.dirname(currencyGeoDataFilePath);
  // Create directory recursively if it doesn't exist
  fs.mkdirSync(dirPath, { recursive: true });

  // Write the file asynchronously
  await fs.promises.writeFile(
    currencyGeoDataFilePath,
    JSON.stringify(currencySubsetData, null, 2),
    'utf8',
  );
  console.log('Currency module json data subset created successfully.');
};

createCurrencyGeoDataFile();
