import { convertToMajorUnit } from '../index';
import { CurrencyCodeType } from '../types';

describe('currency - convertToMajorUnit', () => {
  const testCases: {
    amount: number;
    currency: CurrencyCodeType;
    expectedResult: number;
  }[] = [
    { amount: 100, currency: 'USD', expectedResult: 1 },
    { amount: 100, currency: 'GBP', expectedResult: 1 },
  ];

  testCases.forEach(({ amount, currency, expectedResult }) => {
    it(`should correctly convert ${amount} of minor unit ${currency} to ${expectedResult}`, () => {
      const result = convertToMajorUnit(amount, { currency: currency });
      expect(result).toBe(expectedResult);
    });
  });

  it('should throw an error for unsupported currency codes', () => {
    const unsupportedCurrencyCode = 'XXX';
    expect(() => {
      // @ts-expect-error intented invalid currencyCode for testing
      convertToMajorUnit(100, { currency: unsupportedCurrencyCode });
    }).toThrow('Unsupported currency XXX');
  });
});
