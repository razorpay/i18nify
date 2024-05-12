import { CountryCodeType } from '../../types';
import { getMaskedPhoneNumber, GetMaskedPhoneNumberOptions } from '../index';

describe('phoneNumber - getMaskedPhoneNumber', () => {
  it('should throw an error when both countryCode and phoneNumber are empty', () => {
    expect(() =>
      getMaskedPhoneNumber({
        countryCode: '' as CountryCodeType,
        phoneNumber: '',
      }),
    ).toThrow('Both countryCode and phoneNumber cannot be empty.');
  });

  it.each([
    {
      countryCode: 'US',
      phoneNumber: '+1234567890',
      result: '+1 xxx-xxx-xxxx',
      completeMasking: true,
    },
    {
      countryCode: 'GB',
      phoneNumber: '+447911123456',
      result: '+44 xxxx xx3 456',
      maskedDigitsCount: 6,
      maskingChar: 'x',
      prefixMasking: true,
    },
    {
      countryCode: 'IN',
      phoneNumber: '+919876543210',
      result: '+91 9876 54321#',
      maskedDigitsCount: 1,
      maskingChar: '#',
      prefixMasking: false,
    },
  ])(
    'should apply masking correctly for different countries and options',
    ({
      countryCode,
      phoneNumber,
      result,
      completeMasking,
      maskedDigitsCount,
      maskingChar,
      prefixMasking,
    }) => {
      const options = {
        countryCode,
        phoneNumber,
        maskingOptions: {
          completeMasking: completeMasking ?? false,
          prefixMasking: prefixMasking ?? true,
          maskedDigitsCount: maskedDigitsCount ?? 0,
          maskingChar: maskingChar ?? 'x',
        },
      };
      const maskedPhoneNumber = getMaskedPhoneNumber(
        options as GetMaskedPhoneNumberOptions,
      );
      expect(maskedPhoneNumber).toBe(result);
    },
  );

  it('should handle phone numbers with and without leading plus sign', () => {
    const testCases = [
      {
        countryCode: 'US',
        phoneNumber: '+1234567890',
        expected: '+1 xxx-xxx-xxxx',
      },
      {
        countryCode: 'US',
        phoneNumber: '1234567890',
        expected: '+1 xxx-xxx-xxxx',
      },
    ];

    testCases.forEach(({ countryCode, phoneNumber, expected }) => {
      const options = {
        countryCode,
        phoneNumber,
        maskingOptions: { completeMasking: true },
      };
      const result = getMaskedPhoneNumber(
        options as GetMaskedPhoneNumberOptions,
      );
      expect(result).toBe(expected);
    });
  });

  it('should throw error for invalid country code', () => {
    const optionsWithPhoneNumber = {
      countryCode: 'XX' as CountryCodeType, // Invalid country code
      phoneNumber: '0123456789',
    };
    const optionsWithoutPhoneNumber = {
      countryCode: 'XX' as CountryCodeType, // Invalid country code
    };
    expect(() => getMaskedPhoneNumber(optionsWithPhoneNumber)).toThrow(
      'Error: Parameter "phoneNumber" is invalid: 0123456789',
    );
    expect(() => getMaskedPhoneNumber(optionsWithoutPhoneNumber)).toThrow(
      'Parameter "countryCode" is invalid: XX',
    );
  });

  it.each([
    {
      countryCode: 'DE',
      phoneNumber: '+4915212345678',
      expected: '+49 xxx xxxxxxxx',
    },
    {
      countryCode: 'JP',
      phoneNumber: '+819012345678',
      expected: '+81 xx xxxx xxxx',
    },
    {
      countryCode: 'RU',
      phoneNumber: '+79031234567',
      expected: '+7 xxx xxx-xx-xx',
    },
    {
      countryCode: 'KZ',
      phoneNumber: '+77011234567',
      expected: '+7 xxx-xxx-xx-xx',
    },
  ])(
    'should format correctly with dial code for different countries',
    ({ countryCode, phoneNumber, expected }) => {
      expect(
        getMaskedPhoneNumber({
          countryCode: countryCode as CountryCodeType,
          phoneNumber,
        }),
      ).toBe(expected);
    },
  );

  it('should throw error when maskedDigitsCount exceeds the phone number length', () => {
    const options = {
      countryCode: 'US',
      phoneNumber: '+1234567890',
      maskingOptions: {
        completeMasking: false,
        maskedDigitsCount: 20, // Excessive count
      },
    };
    expect(() =>
      getMaskedPhoneNumber(options as GetMaskedPhoneNumberOptions),
    ).toThrow(
      'maskedDigitsCount exceeds phone number length. Value of "maskedDigitsCount" is 20',
    );
  });

  it('should format the phone number without including the dial code when withDialCode is false', () => {
    const options = {
      countryCode: 'US',
      withDialCode: false,
      maskingOptions: {
        completeMasking: true,
      },
    };
    const expectedOutput = 'xxx-xxx-xxxx';
    const result = getMaskedPhoneNumber(options as GetMaskedPhoneNumberOptions);
    expect(result).toBe(expectedOutput);
  });
});
