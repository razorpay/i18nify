import { convertToMajorUnit } from '../index';
import { CurrencyCodeType } from '../types';

const ZERO_EXPONENT_CURRENCIES = [
  'BIF',
  'DJF',
  'GNF',
  'IDR',
  'JPY',
  'KMF',
  'KRW',
  'PYG',
  'RWF',
  'UGX',
  'VUV',
  'XAF',
  'XOF',
  'XPF',
] as const;

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

  ZERO_EXPONENT_CURRENCIES.forEach((currency) => {
    it(`should correctly convert zero exponent currency ${currency} i.e 100 to 100 major unit`, () => {
      const result = convertToMajorUnit(100, { currency });
      expect(result).toBe(100);
    });
  });
});
