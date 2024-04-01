import { CurrencyCodeType, getPhysicalCurrencyDenominations } from '../index';

describe('currency - getPhysicalCurrencyDenominations', () => {
  // Array of test scenarios
  const testScenarios = [
    {
      currencyCode: 'USD',
      expectedDenominations: ['1', '5', '10', '25', '50', '100'],
    },
    {
      currencyCode: 'EUR',
      expectedDenominations: ['1', '2', '5', '10', '20', '50', '100', '200'],
    },
  ];

  // Loop over each scenario to perform tests
  testScenarios.forEach(({ currencyCode, expectedDenominations }) => {
    it(`returns the correct denominations for ${currencyCode}`, () => {
      const result = getPhysicalCurrencyDenominations(
        currencyCode as CurrencyCodeType,
      );
      expect(result).toEqual(expectedDenominations);
    });
  });

  it('throws error for a non-existent currency code', () => {
    expect(() =>
      getPhysicalCurrencyDenominations('XYZ' as CurrencyCodeType),
    ).toThrow('Error: Invalid currencyCode: XYZ');
  });
});
