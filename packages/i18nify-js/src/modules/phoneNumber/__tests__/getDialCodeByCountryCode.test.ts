import { getDialCodeByCountryCode } from '../index';

describe('phoneNumber - getDialCodeByCountryCode', () => {
  it('should return the correct dial code for valid country codes', () => {
    const testCases = [
      { countryCode: 'US', expectedDialCode: '+1' },
      { countryCode: 'RU', expectedDialCode: '+7' },
      { countryCode: 'IN', expectedDialCode: '+91' },
      { countryCode: 'BR', expectedDialCode: '+55' },
      { countryCode: 'DE', expectedDialCode: '+49' },
    ];

    // Iterate over the test cases and check if the function returns the expected dial code
    testCases.forEach(({ countryCode, expectedDialCode }) => {
      const dialCode = getDialCodeByCountryCode(countryCode as any);
      expect(dialCode).toBe(expectedDialCode);
    });
  });

  it('should throw an error for invalid country codes', () => {
    const invalidCountryCode = 'XX'; // XX is not a valid country code
    expect(() => getDialCodeByCountryCode(invalidCountryCode as any)).toThrow(
      new Error(
        `Error: The provided country code is invalid. The received value was: ${invalidCountryCode}. Please ensure you pass a valid country code. Check valid country codes here: https://github.com/razorpay/i18nify/blob/master/i18nify-data/country/metadata/data.json`,
      ),
    );
  });
});
