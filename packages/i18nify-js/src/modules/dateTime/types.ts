import { ALLOWED_FORMAT_PARTS_KEYS } from './constants';

export type DateInput = Date | string | number;
export type Locale = string;

export interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {}

export interface DateFormatOptions
  extends Omit<Intl.DateTimeFormatOptions, 'timeStyle'> {}

export interface TimeFormatOptions
  extends Omit<Intl.DateTimeFormatOptions, 'dateStyle'> {}

export type FormattedPartsObject = {
  [key in (typeof ALLOWED_FORMAT_PARTS_KEYS)[number]]?: string | undefined;
};

export interface ParsedDateTime extends FormattedPartsObject {
  rawParts: Array<{ type: string; value: unknown }>;
  formattedDate: string;
  date: Date | null;
}

export interface SupportedDateFormats {
  regex: RegExp;
  yearIndex: number;
  monthIndex: number;
  dayIndex: number;
  hourIndex?: number;
  minuteIndex?: number;
  secondIndex?: number;
  format: string;
}

export interface TimezoneInfo {
  utc_offset: string;
}

export interface LocaleInfo {
  name: string;
}

export interface CountryMetaType {
  country_name: string;
  continent_code: string;
  continent_name: string;
  alpha_3: string;
  numeric_code: string;
  flag: string;
  sovereignty: string;
  dial_code: string;
  supportedCurrency: string[];
  timezones: Record<string, TimezoneInfo>;
  timezone_of_capital: string;
  locales: Record<string, LocaleInfo>;
  default_locale: string;
  default_currency: string;
}

export interface CountryMetadataInformation {
  [countryCode: string]: CountryMetadata;
}

export interface CountryDataApiResponse {
  metadata_information: CountryMetadataInformation;
}
