import currencyOriginalData from '#/i18nify-data/currency/data.json';
import { createModuleSubsetFile } from './jsonSubsetGenerator';
import {
  currencyGeoDataFilePath,
  transformCurrencyData,
} from './transformerFunctions';
import { CurrencyInformation, CurrencySubsetData, TransformFunction } from './types';

const subsetMap = [
  [currencyOriginalData, currencyGeoDataFilePath, transformCurrencyData],
];

subsetMap.forEach((module) => createModuleSubsetFile<CurrencyInformation, CurrencySubsetData>(
  module[0] as CurrencyInformation,
  module[1] as string,
  module[2] as TransformFunction<CurrencyInformation, CurrencySubsetData>
));
