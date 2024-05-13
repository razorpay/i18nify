import { CountryCodeType } from '../..';

export interface MaskingOptions {
  maskingStyle?: 'full' | 'prefix' | 'suffix' | 'alternate';
  maskedDigitsCount?: number;
  maskingChar?: string;
}

export interface GetMaskedPhoneNumberOptions {
  countryCode: CountryCodeType;
  withDialCode?: boolean;
  phoneNumber?: string;
  maskingOptions?: MaskingOptions;
}
