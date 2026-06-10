import { convertStringToMinorUnit } from '../index';
import { CurrencyCodeType } from '../types';

describe('currency - convertStringToMinorUnit', () => {
  const testCases: {
    amount: string;
    currency: CurrencyCodeType;
    expectedResult: number;
  }[] = [
    // Plain decimal strings
    { amount: '10.50', currency: 'USD', expectedResult: 1050 },
    { amount: '100', currency: 'USD', expectedResult: 10000 },
    { amount: '0.01', currency: 'USD', expectedResult: 1 },
    // US format with thousands separator
    { amount: '1,234.56', currency: 'USD', expectedResult: 123456 },
    { amount: '1,000,000.00', currency: 'USD', expectedResult: 100000000 },
    // Symbol-prefixed strings
    { amount: '$10.50', currency: 'USD', expectedResult: 1050 },
    { amount: '£10.50', currency: 'GBP', expectedResult: 1050 },
    { amount: '₹4.14', currency: 'INR', expectedResult: 414 },
    // European format (comma as decimal separator)
    { amount: '10,50', currency: 'EUR', expectedResult: 1050 },
    { amount: '1.234,56', currency: 'EUR', expectedResult: 123456 },
    { amount: '€10,50', currency: 'EUR', expectedResult: 1050 },
    // Currencies with 0 minor units
    { amount: '1234', currency: 'JPY', expectedResult: 1234 },
    { amount: '¥1,234', currency: 'JPY', expectedResult: 1234 },
    // Currencies with 3 minor units (e.g. BHD — Bahraini Dinar)
    { amount: '10.500', currency: 'BHD', expectedResult: 10500 },
    { amount: '1.234', currency: 'BHD', expectedResult: 1234 },
  ];

  testCases.forEach(({ amount, currency, expectedResult }) => {
    it(`should convert "${amount}" (${String(currency)}) → ${expectedResult} minor units`, () => {
      const result = convertStringToMinorUnit(amount, { currency });
      expect(result).toBe(expectedResult);
    });
  });

  it('should throw for an unsupported currency code', () => {
    expect(() =>
      convertStringToMinorUnit('10.50', {
        currency: 'XXX' as CurrencyCodeType,
      }),
    ).toThrow('Please ensure you pass a valid currency code');
  });

  it('should throw for a non-numeric amount string', () => {
    expect(() => convertStringToMinorUnit('abc', { currency: 'USD' })).toThrow(
      'Invalid amount string',
    );
  });

  it('should throw for an empty amount string', () => {
    expect(() => convertStringToMinorUnit('', { currency: 'USD' })).toThrow(
      'Invalid amount string',
    );
  });
});
