import { CountryCodeType } from '../../types';
import { getMaskedPhoneNumber, GetMaskedPhoneNumberOptions } from '../index';

describe('phoneNumber - getMaskedPhoneNumber', () => {
  it('should throw error if no countryCode and phoneNumber are provided', () => {
    expect(() =>
      getMaskedPhoneNumber({} as GetMaskedPhoneNumberOptions),
    ).toThrow('Either countryCode and phoneNumber is mandatory.');
  });

  it('should throw error for invalid country code when phone number is not provided', () => {
    expect(() =>
      getMaskedPhoneNumber({ countryCode: 'ZZ' as CountryCodeType }),
    ).toThrow('Parameter "countryCode" is invalid: ZZ');
  });

  it('should throw error for invalid country code when phone number is provided', () => {
    const options = {
      countryCode: 'ZZ' as CountryCodeType,
      phoneNumber: '7394926646',
    };
    const expected = 'xxxxxxxxxx';
    expect(getMaskedPhoneNumber(options)).toEqual(expected);
  });

  it('should return full masked phone number with dial code', () => {
    const options = {
      countryCode: 'US',
      phoneNumber: '+12345678901',
      withDialCode: true,
      maskingOptions: { maskingStyle: 'full' },
    };
    const expected = '+1 xxx-xxx-xxxx';
    expect(
      getMaskedPhoneNumber(options as GetMaskedPhoneNumberOptions),
    ).toEqual(expected);
  });

  it('should return phone number masked with prefix', () => {
    const options = {
      countryCode: 'US',
      phoneNumber: '2345678901',
      withDialCode: false,
      maskingOptions: { maskingStyle: 'prefix', maskedDigitsCount: 6 },
    };
    const expected = 'xxx-xxx-8901';
    expect(
      getMaskedPhoneNumber(options as GetMaskedPhoneNumberOptions),
    ).toEqual(expected);
  });

  it('should return phone number masked with suffix', () => {
    const options = {
      countryCode: 'US',
      phoneNumber: '2345678901',
      withDialCode: false,
      maskingOptions: { maskingStyle: 'suffix', maskedDigitsCount: 6 },
    };
    const expected = '234-5xx-xxxx';
    expect(
      getMaskedPhoneNumber(options as GetMaskedPhoneNumberOptions),
    ).toEqual(expected);
  });

  it('should handle alternate masking of digits', () => {
    const options = {
      countryCode: 'US',
      phoneNumber: '2345678901',
      withDialCode: false,
      maskingOptions: { maskingStyle: 'alternate', maskingChar: '*' },
    };
    const expected = '2*4*6*8*0*';
    expect(
      getMaskedPhoneNumber(options as GetMaskedPhoneNumberOptions),
    ).toEqual(expected);
  });

  it('should handle no phoneNumber with just country code', () => {
    const options = {
      countryCode: 'US',
      withDialCode: true,
    };
    const expected = '+1 xxx-xxx-xxxx';
    expect(
      getMaskedPhoneNumber(options as GetMaskedPhoneNumberOptions),
    ).toEqual(expected);
  });

  it('should return phone number with full masking and dial code', () => {
    const options = {
      countryCode: 'US',
      phoneNumber: '2345678901',
      withDialCode: true,
      maskingOptions: { maskingStyle: 'full', maskingChar: '#' },
    };
    const expected = '+1 ###-###-####';
    expect(
      getMaskedPhoneNumber(options as GetMaskedPhoneNumberOptions),
    ).toEqual(expected);
  });

  it('should return formatted phone number with complete masking when no masking options provided', () => {
    const options = {
      countryCode: 'US',
      phoneNumber: '2345678901',
      withDialCode: true,
    };
    const expected = '+1 xxx-xxx-xxxx';
    expect(
      getMaskedPhoneNumber(options as GetMaskedPhoneNumberOptions),
    ).toEqual(expected);
  });

  it('should handle input with non-numeric characters in phoneNumber', () => {
    const options = {
      countryCode: 'US',
      phoneNumber: '+1 (234) 567-8901',
      withDialCode: false,
      maskingOptions: { maskingStyle: 'full', maskingChar: '*' },
    };
    const expected = '***-***-****';
    expect(
      getMaskedPhoneNumber(options as GetMaskedPhoneNumberOptions),
    ).toEqual(expected);
  });

  it('should perform complete masking if maskedDigitsCount is larger than phoneNumber length', () => {
    const options = {
      countryCode: 'US',
      phoneNumber: '12345',
      withDialCode: false,
      maskingOptions: { maskingStyle: 'suffix', maskedDigitsCount: 10 },
    };
    const expected = 'xxx-xxx-xxxx';
    expect(
      getMaskedPhoneNumber(options as GetMaskedPhoneNumberOptions),
    ).toEqual(expected);
  });
});
