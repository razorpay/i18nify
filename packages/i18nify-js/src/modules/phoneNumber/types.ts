import { CountryCodeType } from '../..';

export interface MaskingOptions {
  completeMasking?: boolean;
  prefixMasking?: boolean;
  maskedDigitsCount?: number;
  maskingChar?: string;
}

export interface GetMaskedPhoneNumberOptions {
  countryCode: CountryCodeType;
  withDialCode?: boolean;
  phoneNumber?: string;
  maskingOptions?: MaskingOptions;
}
