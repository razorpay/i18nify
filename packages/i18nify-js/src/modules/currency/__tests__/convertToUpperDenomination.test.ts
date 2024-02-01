import convertToUpperDenomination from '../convertToUpperDenomination';
import { CURRENCIES } from '../data/currencies';

describe('currency - convertToUpperDenomination', () => {
  const testCases: {
    amount: number;
    currency: keyof typeof CURRENCIES;
    expectedResult: number;
  }[] = [
    { amount: 100, currency: 'USD', expectedResult: 1 },
    { amount: 100, currency: 'GBP', expectedResult: 1 },
  ];

  testCases.forEach(({ amount, currency, expectedResult }) => {
    it(`should correctly convert ${amount} of lower denomination ${currency} to ${expectedResult}`, () => {
      const result = convertToUpperDenomination(amount, { currency: currency });
      expect(result).toBe(expectedResult);
    });
  });

  it('should throw an error for unsupported currency codes', () => {
    const unsupportedCurrencyCode = 'XXX' as any; // Casting to 'any' to simulate runtime scenario
    expect(() => {
      convertToUpperDenomination(100, { currency: unsupportedCurrencyCode });
    }).toThrow('Unsupported currency XXX');
  });
});
