import convertToMinorUnit from '../convertToMinorUnit';
import { CurrencyCodeType } from '../types';

describe('currency - convertToMinorUnit', () => {
  const testCases: {
    amount: number;
    currency: CurrencyCodeType;
    expectedResult: number;
  }[] = [
    { amount: 1, currency: 'USD', expectedResult: 100 },
    { amount: 1, currency: 'GBP', expectedResult: 100 },
  ];

  testCases.forEach(({ amount, currency, expectedResult }) => {
    it(`should correctly convert ${amount} of minor unit ${currency} to ${expectedResult}`, () => {
      const result = convertToMinorUnit(amount, { currency: currency });
      expect(result).toBe(expectedResult);
    });
  });

  it('should throw an error for unsupported currency codes', () => {
    const unsupportedCurrencyCode = 'XXX';
    expect(() => {
      // @ts-expect-error intented invalid currencyCode for testing
      convertToMinorUnit(100, { currency: unsupportedCurrencyCode });
    }).toThrow('Unsupported currency XXX');
  });
});
