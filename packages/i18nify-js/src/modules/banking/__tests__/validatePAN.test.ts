import validatePAN from '../validatePAN';

describe('validatePAN', () => {
  describe('valid PANs', () => {
    it('individual (P)', () => expect(validatePAN('ABCPD1234F')).toBe(true));
    it('company (C)', () => expect(validatePAN('AABCD1234E')).toBe(true)); // C at index 3
    it('HUF (H)', () => expect(validatePAN('AABHD1234E')).toBe(true));
    it('firm (F)', () => expect(validatePAN('AABFD1234E')).toBe(true));
    it('AOP (A)', () => expect(validatePAN('AAAAD1234R')).toBe(true)); // A at index 3
    it('trust (T)', () => expect(validatePAN('AAATD1234E')).toBe(true));
    it('normalises lowercase input', () =>
      expect(validatePAN('abcpd1234f')).toBe(true));
    it('normalises padded whitespace', () =>
      expect(validatePAN('  ABCPD1234F  ')).toBe(true));
  });

  describe('invalid PANs', () => {
    it('too short', () => expect(validatePAN('ABCPD123')).toBe(false));
    it('too long', () => expect(validatePAN('ABCPD1234FX')).toBe(false));
    it('invalid entity char at position 4', () =>
      expect(validatePAN('ABCZD1234F')).toBe(false));
    it('digit in first 3 chars', () =>
      expect(validatePAN('1BCPD1234F')).toBe(false));
    it('letter where 4 digits expected', () =>
      expect(validatePAN('ABCPDABCDF')).toBe(false));
    it('lowercase last char (after normalising uppercase, valid)', () =>
      expect(validatePAN('ABCPD1234f')).toBe(true));
  });

  describe('error cases', () => {
    it('throws for empty string', () =>
      expect(() => validatePAN('')).toThrow());
    // @ts-expect-error testing invalid type
    it('throws for null', () => expect(() => validatePAN(null)).toThrow());
  });
});
