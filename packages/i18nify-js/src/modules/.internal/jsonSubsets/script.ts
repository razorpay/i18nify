import currencyOriginalData from '#/i18nify-data/currency/data.json';
import { createModuleSubsetFile } from './jsonSubsetGenerator';
import {
  currencyGeoDataFilePath,
  transformCurrencyData,
} from './transformerFunctions';
import { CurrencyInformation, CurrencySubsetData } from './types';

const subsetMap = [
  [currencyOriginalData, currencyGeoDataFilePath, transformCurrencyData],
];

subsetMap.forEach((module) => {
  createModuleSubsetFile<CurrencyInformation, CurrencySubsetData>(
    module[0],
    module[1],
    module[2],
  );
});
