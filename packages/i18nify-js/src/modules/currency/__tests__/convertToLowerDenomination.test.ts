import convertToLowerDenomination from '../convertToLowerDenomination';
import { CURRENCIES } from '../data/currencies';

describe('currency - convertToLowerDenomination', () => {
  const testCases: {
    amount: number;
    currency: keyof typeof CURRENCIES;
    expectedResult: number;
  }[] = [
    { amount: 1, currency: 'USD', expectedResult: 100 },
    { amount: 1, currency: 'GBP', expectedResult: 100 },
  ];

  testCases.forEach(({ amount, currency, expectedResult }) => {
    it(`should correctly convert ${amount} of lower denomination ${currency} to ${expectedResult}`, () => {
      const result = convertToLowerDenomination(amount, { currency: currency });
      expect(result).toBe(expectedResult);
    });
  });

  it('should throw an error for unsupported currency codes', () => {
    const unsupportedCurrencyCode = 'XXX';
    expect(() => {
      // @ts-expect-error intented invalid currencyCode for testing
      convertToLowerDenomination(100, { currency: unsupportedCurrencyCode });
    }).toThrow('Unsupported currency XXX');
  });
});
