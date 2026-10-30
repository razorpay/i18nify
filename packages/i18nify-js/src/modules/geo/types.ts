import { CountryCodeType } from '../types';

export type CountryMetaType = {
  country_name: string;
  continent_code: string;
  continent_name: string;
  alpha_3: string;
  numeric_code: string;
  flag: string;
  sovereignty: string;
  dial_code: string;
  supported_currency: string[];
  timezones: Record<string, { utc_offset: string }>;
  timezone_of_capital: string;
  locales: Record<string, { name: string }>;
  default_locale: string;
  default_currency: string;
  address_template?: string;
};

export type CityType = {
  name: string;
  timezone: string;
  zipcodes: string[];
  'region_name/district_name': string;
};

export type StateType = {
  name: string;
  cities: {
    [cityName: string]: CityType;
  };
};

export type CountryDetailType = {
  country_name: string;
  states: {
    [stateCode: string]: StateType;
  };
};

// i18nify-data now ships state-level subdivision files for every ISO-3166
// country (see I18NIFY_SUBDIVISION_SUPPORTED_COUNTRIES), so getStates accepts
// any country code rather than the original IN | MY | SG | US set. City/zipcode
// lookups remain gated to the rich-data countries (I18NIFY_DATA_SUPPORTED_COUNTRIES).
export type I18nifyCountryCodeType = CountryCodeType;

export type AddressComponents = {
  name?: string;
  organization?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip?: string;
  district?: string;
  sorting_code?: string;
};

export type AddressCodeType = string;

export type AddressType = {
  country_name: string;
  address_template: string;
};
