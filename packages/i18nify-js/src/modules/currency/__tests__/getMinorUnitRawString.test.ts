import { getMinorUnitRawString } from '../index';
import { CurrencyCodeType } from '../types';

describe('currency - getMinorUnitRawString', () => {
  const testCases: {
    amount: number;
    currency: CurrencyCodeType;
    expected: string;
  }[] = [
    { amount: 100, currency: 'USD', expected: '10000' },
    { amount: 1, currency: 'USD', expected: '100' },
    { amount: 4.14, currency: 'INR', expected: '414' },
    { amount: 1, currency: 'GBP', expected: '100' },
  ];

  testCases.forEach(({ amount, currency, expected }) => {
    it(`returns "${expected}" for ${amount} ${String(currency)}`, () => {
      expect(getMinorUnitRawString(amount, { currency })).toBe(expected);
    });
  });

  it('returns a plain string with no symbol or separator', () => {
    const result = getMinorUnitRawString(1234.56, { currency: 'USD' });
    expect(result).toMatch(/^\d+$/);
  });

  it('throws for unsupported currency code', () => {
    expect(() =>
      getMinorUnitRawString(100, { currency: 'XXX' as CurrencyCodeType }),
    ).toThrow('The provided currency code is either empty or not supported');
  });
});
