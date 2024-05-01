import { convertToMinorUnit } from '../index';
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
    it(`should correctly convert ${amount} of minor unit ${String(currency)} to ${expectedResult}`, () => {
      const result = convertToMinorUnit(amount, { currency: currency });
      expect(result).toBe(expectedResult);
    });
  });

  it('should throw an error for unsupported currency codes', () => {
    const unsupportedCurrencyCode = 'XXX';
    expect(() => {
      convertToMinorUnit(100, {
        currency: unsupportedCurrencyCode as CurrencyCodeType,
      });
    }).toThrow('Unsupported currency XXX');
  });
});
