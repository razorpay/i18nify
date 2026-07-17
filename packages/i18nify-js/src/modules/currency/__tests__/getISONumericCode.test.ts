import getISONumericCode from '../getISONumericCode';
import type { CurrencyCodeType } from '../types';

describe('getISONumericCode', () => {
  describe('well-known alpha→numeric mappings', () => {
    it.each<[CurrencyCodeType, string]>([
      ['USD', '840'],
      ['INR', '356'],
      ['EUR', '978'],
      ['JPY', '392'],
      ['GBP', '826'],
      ['AUD', '036'],
      ['CAD', '124'],
      ['CHF', '756'],
      ['CNY', '156'],
      ['BHD', '048'],
      ['KWD', '414'],
    ])('%s → "%s"', (code, expected) => {
      expect(getISONumericCode(code)).toBe(expected);
    });
  });

  describe('zero-padded codes', () => {
    it('returns zero-padded string for ALL (008, not 8)', () => {
      expect(getISONumericCode('ALL')).toBe('008');
    });

    it('returns zero-padded string for AUD (036, not 36)', () => {
      expect(getISONumericCode('AUD')).toBe('036');
    });
  });

  describe('return type', () => {
    it('returns a string, not a number', () => {
      expect(typeof getISONumericCode('USD')).toBe('string');
    });

    it('returned string is exactly 3 characters', () => {
      const codes: CurrencyCodeType[] = [
        'USD',
        'EUR',
        'INR',
        'JPY',
        'ALL',
        'AUD',
        'BHD',
      ];
      for (const code of codes) {
        expect(getISONumericCode(code)).toHaveLength(3);
      }
    });
  });

  describe('invalid inputs', () => {
    it('throws for an unknown code', () => {
      expect(() => getISONumericCode('XYZ' as CurrencyCodeType)).toThrow(
        /Invalid currency code/,
      );
    });

    it('throws for lowercase code', () => {
      expect(() => getISONumericCode('usd' as CurrencyCodeType)).toThrow();
    });
  });
});
