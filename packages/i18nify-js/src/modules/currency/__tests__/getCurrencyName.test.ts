import { CurrencyCodeType, getCurrencyName } from '../index';

describe('currency - getCurrencyName', () => {
  // Test scenarios for different currencies
  const testScenarios = [
    {
      currencyCode: 'USD',
      expectedName: 'US Dollar',
    },
    {
      currencyCode: 'EUR',
      expectedName: 'Euro',
    },
  ];

  // Loop over each scenario to perform tests
  testScenarios.forEach(({ currencyCode, expectedName }) => {
    it(`returns the correct name for ${currencyCode}`, () => {
      const result = getCurrencyName(currencyCode as CurrencyCodeType);
      expect(result).toEqual(expectedName);
    });
  });

  it('throws error for a non-existent currency code', () => {
    expect(() => getCurrencyName('XYZ' as CurrencyCodeType)).toThrow(
      'Error: Invalid currencyCode: XYZ',
    );
  });
});
