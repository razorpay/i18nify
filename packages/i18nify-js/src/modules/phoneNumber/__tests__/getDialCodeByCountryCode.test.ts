import getDialCodeByCountryCode from '../getDialCodeByCountryCode';

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
      `Invalid countryCode: ${invalidCountryCode}`,
    );
  });
});
