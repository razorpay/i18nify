import { CountryCodeType } from '../..';
import { MaskingStyle } from './constants';

export interface MaskingOptions {
  maskingStyle?: MaskingStyle;
  maskedDigitsCount?: number;
  maskingChar?: string;
}

export interface GetMaskedPhoneNumberOptions {
  countryCode: CountryCodeType;
  withDialCode?: boolean;
  phoneNumber?: string;
  maskingOptions?: MaskingOptions;
}
