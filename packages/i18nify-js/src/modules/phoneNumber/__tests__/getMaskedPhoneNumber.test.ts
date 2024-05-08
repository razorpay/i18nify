import { CountryCodeType } from '../../types';
import { getMaskedPhoneNumber } from '../index';

describe('phoneNumber - getMaskedPhoneNumber', () => {
  // Test data array for multiple countries
  const testCasesWithDialCode = [
    { countryCode: 'US', expected: '+1 xxx-xxx-xxxx' },
    { countryCode: 'GB', expected: '+44 xxxx xxx xxx' },
    { countryCode: 'DE', expected: '+49 xxx xxxxxxxx' },
    { countryCode: 'IN', expected: '+91 xxxx xxxxxx' },
    { countryCode: 'JP', expected: '+81 xx xxxx xxxx' },
  ];

  // Tests for valid inputs including dial code
  testCasesWithDialCode.forEach(({ countryCode, expected }) => {
    it(`should return the correct phone number format including dial code for ${countryCode}`, () => {
      const result = getMaskedPhoneNumber(countryCode as CountryCodeType, true);
      expect(result).toBe(expected);
    });
  });

  // Tests for valid inputs without dial code
  testCasesWithDialCode.forEach(({ countryCode, expected }) => {
    it(`should return the correct phone number format without dial code for ${countryCode}`, () => {
      const result = getMaskedPhoneNumber(
        countryCode as CountryCodeType,
        false,
      );
      // Remove the dial code and leading space from the expected string
      const expectedWithoutDialCode = expected.substring(
        expected.indexOf(' ') + 1,
      );
      expect(result).toBe(expectedWithoutDialCode);
    });
  });

  // Test for invalid country code
  it('should throw an error for an invalid country code', () => {
    expect(() => {
      // @ts-expect-error null is not a valid country code
      getMaskedPhoneNumber('XYZ', true);
    }).toThrow('Parameter "countryCode" is invalid: XYZ');
  });

  // Test for missing country code
  it('should throw an error when country code is undefined', () => {
    expect(() => {
      // @ts-expect-error null is not a valid country code
      getMaskedPhoneNumber(undefined, true);
    }).toThrow('Parameter "countryCode" is invalid: undefined');
  });

  // Test for null country code
  it('should throw an error when country code is null', () => {
    expect(() => {
      // @ts-expect-error null is not a valid country code
      getMaskedPhoneNumber(null, true);
    }).toThrow('Parameter "countryCode" is invalid: null');
  });
});
