import { COUNTRY_TO_ALL_LOCALES } from './data/countryToAllLocales';

export type CountryToLocalesMap = {
  readonly [key: string]: readonly string[];
};

export type CountryCode = keyof typeof COUNTRY_TO_ALL_LOCALES;
