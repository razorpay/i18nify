import validateIFSC from '../validateIFSC';

describe('banking - validateIFSC', () => {
  describe('valid IFSCs', () => {
    it('should accept a valid IFSC (HDFC0001234)', () => {
      expect(validateIFSC('HDFC0001234')).toBe(true);
    });

    it('should accept a valid IFSC (SBIN0000001)', () => {
      expect(validateIFSC('SBIN0000001')).toBe(true);
    });

    it('should accept a branch code containing letters', () => {
      expect(validateIFSC('ICIC0ABC123')).toBe(true);
    });

    it('should accept a lowercase IFSC (case-insensitive)', () => {
      expect(validateIFSC('hdfc0001234')).toBe(true);
    });

    it('should accept an IFSC with surrounding whitespace', () => {
      expect(validateIFSC('  HDFC0001234  ')).toBe(true);
    });
  });

  describe('invalid IFSCs', () => {
    it("should reject an IFSC whose 5th char is not '0'", () => {
      expect(validateIFSC('HDFC1001234')).toBe(false);
    });

    it('should reject an IFSC with digits in the bank code', () => {
      expect(validateIFSC('HD120001234')).toBe(false);
    });

    it('should reject an IFSC that is too short', () => {
      expect(validateIFSC('HDFC000123')).toBe(false);
    });

    it('should reject an IFSC that is too long', () => {
      expect(validateIFSC('HDFC00012345')).toBe(false);
    });

    it('should reject an IFSC containing special characters', () => {
      expect(validateIFSC('HDFC0-01234')).toBe(false);
    });
  });

  describe('invalid arguments', () => {
    it('should throw for an empty string', () => {
      expect(() => validateIFSC('')).toThrow(/IFSC/);
    });

    it('should throw for a non-string input', () => {
      // @ts-expect-error testing runtime guard against non-string input
      expect(() => validateIFSC(null)).toThrow(/IFSC/);
    });
  });
});
