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
};

export type CityType = {
  name: string;
  timezone: string;
  zipcodes: string[];
  region_name: string;
};

export type StateType = {
  name: string;
  cities: CityType[];
};

export type CountryDetailType = {
  country_name: string;
  states: {
    [stateCode: string]: StateType;
  };
};

export type I18nifyCountryCodeType = 'IN' | 'MY' | 'SG' | 'US';
