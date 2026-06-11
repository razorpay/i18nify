import { isValidAmount } from '../index';
import { CurrencyCodeType } from '../types';

describe('currency - isValidAmount', () => {
  describe('USD (minor_unit=2)', () => {
    const testCases: { amount: string; expected: boolean }[] = [
      { amount: '10', expected: true },
      { amount: '10.0', expected: true },
      { amount: '10.00', expected: true },
      { amount: '10.99', expected: true },
      { amount: '-10.99', expected: true },
      { amount: '0.01', expected: true },
      { amount: '10.1', expected: true },
      { amount: '10.123', expected: false },
      { amount: '10.999', expected: false },
    ];

    testCases.forEach(({ amount, expected }) => {
      it(`"${amount}" → ${expected}`, () => {
        expect(isValidAmount(amount, { currency: 'USD' })).toBe(expected);
      });
    });
  });

  describe('JPY (minor_unit=0)', () => {
    const testCases: { amount: string; expected: boolean }[] = [
      { amount: '100', expected: true },
      { amount: '-100', expected: true },
      { amount: '100.0', expected: false },
      { amount: '100.00', expected: false },
    ];

    testCases.forEach(({ amount, expected }) => {
      it(`"${amount}" → ${expected}`, () => {
        expect(isValidAmount(amount, { currency: 'JPY' })).toBe(expected);
      });
    });
  });

  describe('KWD (minor_unit=3)', () => {
    const testCases: { amount: string; expected: boolean }[] = [
      { amount: '1.000', expected: true },
      { amount: '1.123', expected: true },
      { amount: '1.1234', expected: false },
    ];

    testCases.forEach(({ amount, expected }) => {
      it(`"${amount}" → ${expected}`, () => {
        expect(isValidAmount(amount, { currency: 'KWD' })).toBe(expected);
      });
    });
  });

  describe('invalid amount formats', () => {
    const invalidAmounts = ['', 'abc', '10.', '.99', '1,000.00', '10.0.0'];

    invalidAmounts.forEach((amount) => {
      it(`"${amount}" → false`, () => {
        expect(isValidAmount(amount, { currency: 'USD' })).toBe(false);
      });
    });
  });

  it('throws for unsupported currency code', () => {
    expect(() => {
      isValidAmount('10.00', { currency: 'XXX' as CurrencyCodeType });
    }).toThrow(
      'Error: The provided currency code is either empty or not supported.',
    );
  });
});
