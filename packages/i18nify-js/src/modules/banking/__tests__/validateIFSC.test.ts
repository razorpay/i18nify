import validateIFSC from '../validateIFSC';

describe('validateIFSC', () => {
  describe('valid IFSCs', () => {
    it('SBI branch', () => expect(validateIFSC('SBIN0001234')).toBe(true));
    it('HDFC branch', () => expect(validateIFSC('HDFC0001234')).toBe(true));
    it('ICICI with letters in branch', () =>
      expect(validateIFSC('ICIC0A12345')).toBe(true));
    it('normalises lowercase', () =>
      expect(validateIFSC('sbin0001234')).toBe(true));
    it('normalises whitespace', () =>
      expect(validateIFSC('  SBIN0001234  ')).toBe(true));
    it('all-digit branch', () =>
      expect(validateIFSC('PUNB0123456')).toBe(true));
  });

  describe('invalid IFSCs', () => {
    it('5th char not 0', () => expect(validateIFSC('SBIN1001234')).toBe(false));
    it('bank code has digits', () =>
      expect(validateIFSC('SB1N0001234')).toBe(false));
    it('too short (10 chars)', () =>
      expect(validateIFSC('SBIN000123')).toBe(false));
    it('too long (12 chars)', () =>
      expect(validateIFSC('SBIN00012345')).toBe(false));
    it('special chars in branch', () =>
      expect(validateIFSC('SBIN0-01234')).toBe(false));
  });

  describe('error cases', () => {
    it('throws for empty string', () =>
      expect(() => validateIFSC('')).toThrow());
    // @ts-expect-error testing invalid type
    it('throws for null', () => expect(() => validateIFSC(null)).toThrow());
  });
});
